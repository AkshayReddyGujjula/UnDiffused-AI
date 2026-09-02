"""
Cross-implementation check: run the real TypeScript (bundled from src/) and the
Python replica over identical pixel data and identical logits, then diff.

If this passes, the Path B numbers in v1_baseline.json can be described as the
extension's actual behaviour rather than as an approximation of it.

Usage:  python compare.py          (from scripts/bench/verify_port)
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
BENCH = HERE.parent
REPO = BENCH.parent.parent
sys.path.insert(0, str(BENCH))

import extension_replica as ext  # noqa: E402

EVAL = REPO / "docs" / "benchmark" / "eval_set_v1"
TOL = 1e-9
RNG = np.random.default_rng(7)


def build_bundle() -> None:
    esbuild = REPO / "node_modules" / ".bin" / "esbuild.cmd"
    if not esbuild.exists():
        esbuild = REPO / "node_modules" / ".bin" / "esbuild"
    cmd = [str(esbuild), str(HERE / "entry.ts"), "--bundle", "--format=esm",
           "--platform=node", "--outfile=" + str(HERE / "bundle.mjs")]
    subprocess.run(cmd, check=True, cwd=str(REPO),
                   stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    print("bundled real src/ modules -> bundle.mjs")


def main() -> None:
    build_bundle()

    manifest = json.loads((EVAL / "manifest.json").read_text(encoding="utf-8"))
    # A spread of shapes and both labels: square AI render, tall/wide reals.
    picks = [manifest["images"][0], manifest["images"][3],
             manifest["images"][50], manifest["images"][52]]

    cases = []
    py_side = {}
    for m in picks:
        path = EVAL / ("real" if m["label"] == "real" else "ai") / m["file"]
        img = Image.open(path).convert("RGB")
        w, h = img.size

        # Dump exact RGBA bytes so both sides see identical pixels.
        rgba = np.dstack([np.asarray(img), np.full((h, w, 1), 255, np.uint8)])
        rgba_path = HERE / (m["file"] + ".rgba")
        rgba_path.write_bytes(rgba.astype(np.uint8).tobytes())

        sample_indices = sorted(RNG.choice(w * h, 25, replace=False).tolist())

        # Deterministic stand-in logits: the parse/fuse check is about arithmetic,
        # not about the model, so fixed pseudo-logits isolate the comparison.
        local_batch = 9
        g_flat = (RNG.standard_normal(4 * 3) * 2.0).round(6).tolist()
        l_flat = (RNG.standard_normal(local_batch * 2) * 2.0).round(6).tolist()

        cases.append({
            "file": m["file"], "width": w, "height": h,
            "rgba_path": str(rgba_path).replace("\\", "/"),
            "sample_indices": sample_indices,
            "global_flat": g_flat,
            "local_flat": l_flat,
            "local_batch": local_batch,
        })

        qmap = ext.compute_quality_map(img)
        crops = ext.get_adaptive_crops(w, h, qmap, 9)
        flat_q = qmap.reshape(-1)
        py_side[m["file"]] = {
            "qmap": {"mean": float(flat_q.mean()), "min": float(flat_q.min()),
                     "max": float(flat_q.max()), "len": int(flat_q.size)},
            "qmap_samples": [float(flat_q[i]) for i in sample_indices],
            "adaptive_crops": [{"x": c["x"], "y": c["y"],
                                "width": c["width"], "height": c["height"]} for c in crops],
            "grid_crops": [{"x": c["x"], "y": c["y"]}
                           for c in ext.generate_grid_crops(w, h)],
            "quadrants": ext.quadrant_crops(w, h),
            "parsed_global": ext.parse_logits_as_shipped(
                np.array(g_flat).reshape(4, 3)),
            "parsed_local": ext.parse_logits_as_shipped(
                np.array(l_flat).reshape(local_batch, 2)),
        }
        fin, gl, lo, _ = ext.fuse_as_shipped(
            py_side[m["file"]]["parsed_global"], py_side[m["file"]]["parsed_local"])
        py_side[m["file"]]["fused"] = {"finalAiProb": fin, "globalAiProb": gl,
                                       "localAiProb": lo}

    spec_path = HERE / "spec.json"
    ts_out_path = HERE / "ts_result.json"
    spec_path.write_text(json.dumps({"cases": cases}), encoding="utf-8")

    subprocess.run(["node", str(HERE / "run_ts.mjs"), str(spec_path), str(ts_out_path)],
                   check=True, cwd=str(HERE))

    ts = json.loads(ts_out_path.read_text(encoding="utf-8"))

    failures = []
    for case in ts["cases"]:
        f = case["file"]
        py = py_side[f]
        print("\n--- {} ---".format(f))

        for k in ("mean", "min", "max"):
            d = abs(case["qmap"][k] - py["qmap"][k])
            ok = d < 1e-6
            print("  qmap.{:<5s} ts={:.10f} py={:.10f} diff={:.2e} {}".format(
                k, case["qmap"][k], py["qmap"][k], d, "OK" if ok else "MISMATCH"))
            if not ok:
                failures.append("{}: qmap.{}".format(f, k))

        sd = max(abs(a - b) for a, b in zip(case["qmap_samples"], py["qmap_samples"]))
        print("  qmap 25 sampled pixels: max diff = {:.2e} {}".format(
            sd, "OK" if sd < 1e-6 else "MISMATCH"))
        if sd >= 1e-6:
            failures.append("{}: qmap samples".format(f))

        for key in ("adaptive_crops", "grid_crops", "quadrants"):
            a = [{kk: vv for kk, vv in d.items() if kk != "label"} for d in case[key]]
            b = [{kk: vv for kk, vv in d.items() if kk != "label"} for d in py[key]]
            ok = a == b
            print("  {:<15s} ts={} py={} {}".format(
                key, len(a), len(b), "OK" if ok else "MISMATCH"))
            if not ok:
                failures.append("{}: {}".format(f, key))
                print("     ts:", a)
                print("     py:", b)

        for key in ("parsed_global", "parsed_local"):
            d = max(abs(x - y) for x, y in zip(case[key], py[key]))
            print("  {:<15s} max diff = {:.2e} {}".format(
                key, d, "OK" if d < TOL else "MISMATCH"))
            if d >= TOL:
                failures.append("{}: {}".format(f, key))

        d = abs(case["fused"]["finalAiProb"] - py["fused"]["finalAiProb"])
        print("  fused.final     ts={:.12f} py={:.12f} diff={:.2e} {}".format(
            case["fused"]["finalAiProb"], py["fused"]["finalAiProb"], d,
            "OK" if d < TOL else "MISMATCH"))
        if d >= TOL:
            failures.append("{}: fused".format(f))

    print("\n" + "=" * 62)
    if failures:
        print("PORT VERIFICATION FAILED:", failures)
        sys.exit(1)
    print("PORT VERIFICATION PASSED - Python replica matches the shipped TypeScript")

    for c in cases:                                  # tidy up the raw dumps
        Path(c["rgba_path"]).unlink(missing_ok=True)


if __name__ == "__main__":
    main()
