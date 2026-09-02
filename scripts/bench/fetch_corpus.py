"""
Stage 3 (scaled): assemble a training corpus with a generator-family holdout.

Design decisions that matter, and why:

* **SDXL is held out entirely.** The single most reproduced finding in the
  literature is that detectors do not transfer across generators: train on a
  narrow set and you approach chance on unseen families. A benchmark that
  samples all generators into both train and test measures memorisation and
  reports it as accuracy. So SDXL-base-1.0 never appears in training, and the
  headline number is the SDXL result.

* **Real images are split by row offset, and the 50 offsets already used in
  eval_set_v1 are excluded.** Otherwise the v1 baseline set would leak into
  training and every later comparison against it would be invalid.

* **Downloads are parallel.** Sequential fetching of several thousand images is
  hours; a modest thread pool makes it minutes. The bottleneck is network
  latency, not bandwidth or CPU.

Output layout (all inside the repo, image bytes gitignored):

    docs/benchmark/corpus_v1/
        images/<split>/<label>/<file>.jpg
        corpus_manifest.json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import random
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

ROWS_API = "https://datasets-server.huggingface.co/rows"
UA = {"User-Agent": "UnDiffused-benchmark/1.0 (stage-3 corpus)"}

REAL_DATASET = {"dataset": "rafaelpadilla/coco2017", "config": "default", "split": "val"}
AI_DATASET = {"dataset": "elsaEU/ELSA_D3", "config": "default", "split": "train"}

# Which ELSA_D3 column corresponds to which generator family.
GEN_COLUMNS = {
    "image_gen0": "DeepFloyd/IF-II-L-v1.0",
    "image_gen1": "CompVis/stable-diffusion-v1-4",
    "image_gen2": "stabilityai/stable-diffusion-2-1-base",
    "image_gen3": "stabilityai/stable-diffusion-xl-base-1.0",
}

# The holdout. Never seen during training or calibration.
HELDOUT_COLUMN = "image_gen3"
TRAIN_COLUMNS = ["image_gen0", "image_gen1", "image_gen2"]

_print_lock = threading.Lock()


def fetch_rows(spec, offset, length, retries=5):
    params = dict(spec)
    params["offset"] = offset
    params["length"] = length
    last = None
    for attempt in range(retries):
        try:
            r = requests.get(ROWS_API, params=params, headers=UA, timeout=90)
            if r.status_code == 200:
                return r.json()
            last = "HTTP {}".format(r.status_code)
        except requests.RequestException as exc:
            last = repr(exc)
        time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("rows API failed {} @ {}: {}".format(spec, offset, last))


def download(url, dest, retries=3):
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=UA, timeout=90)
            if r.status_code == 200 and r.content:
                dest.write_bytes(r.content)
                return hashlib.sha256(r.content).hexdigest()
        except requests.RequestException:
            pass
        time.sleep(1.0 * (attempt + 1))
    return None


def assign_split(rng: random.Random) -> str:
    """70/15/15 train/val/test on the non-heldout pool."""
    r = rng.random()
    if r < 0.70:
        return "train"
    if r < 0.85:
        return "val"
    return "test"


def harvest(spec, columns, want, rng, exclude_offsets, label, out_root,
            workers, heldout_column=None):
    """Page the rows API, queue download jobs, and write images in parallel."""
    total_rows = fetch_rows(spec, 0, 1)["num_rows_total"]
    jobs = []
    seen = set(exclude_offsets)
    gen_cycle = 0

    # Collect enough job descriptions first; downloading is what we parallelise.
    while len(jobs) < want:
        block = rng.randrange(0, max(1, total_rows - 100))
        try:
            rows = fetch_rows(spec, block, 100)["rows"]
        except RuntimeError as exc:
            print("  rows page failed, continuing: {}".format(exc), file=sys.stderr)
            continue
        rng.shuffle(rows)
        for entry in rows:
            if len(jobs) >= want:
                break
            offset = entry["row_idx"]
            if offset in seen:
                continue
            row = entry["row"]

            if columns is None:                       # real images
                img = row.get("image")
                col, generator = None, None
                split = assign_split(rng)
            else:                                     # generated images
                col = columns[gen_cycle % len(columns)]
                gen_cycle += 1
                img = row.get(col)
                generator = GEN_COLUMNS[col]
                # Held-out generator goes exclusively to the test split.
                split = "test_heldout" if col == heldout_column else assign_split(rng)

            if not isinstance(img, dict) or not img.get("src"):
                continue
            seen.add(offset)

            name = "{}_{}_{}.jpg".format(label, offset, col or "coco")
            dest = out_root / "images" / split / label / name
            jobs.append({
                "url": img["src"], "dest": dest, "file": name, "split": split,
                "label": label, "label_int": 1 if label == "ai" else 0,
                "row_offset": offset, "generator": generator,
                "source_dataset": spec["dataset"],
            })
        with _print_lock:
            print("  queued {}/{} {} jobs".format(len(jobs), want, label))

    for j in jobs:
        j["dest"].parent.mkdir(parents=True, exist_ok=True)

    records = []
    done = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(download, j["url"], j["dest"]): j for j in jobs}
        for fut in as_completed(futures):
            j = futures[fut]
            digest = fut.result()
            done += 1
            if digest is None:
                continue
            records.append({
                "file": j["file"], "split": j["split"], "label": j["label"],
                "label_int": j["label_int"], "row_offset": j["row_offset"],
                "generator": j["generator"], "source_dataset": j["source_dataset"],
                "sha256": digest,
                "relpath": str(j["dest"].relative_to(out_root)).replace("\\", "/"),
            })
            if done % 250 == 0:
                with _print_lock:
                    print("    downloaded {}/{} {}".format(done, len(jobs), label))
    return records


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-real", type=int, default=2500)
    ap.add_argument("--n-ai", type=int, default=2500)
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--seed", type=int, default=20260903)
    ap.add_argument("--out", type=Path, default=Path("docs/benchmark/corpus_v1"))
    ap.add_argument("--eval-manifest", type=Path,
                    default=Path("docs/benchmark/eval_set_v1/manifest.json"))
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    rng = random.Random(args.seed)

    # Never train on anything that is in the v1 baseline evaluation set.
    excluded_real, excluded_ai = set(), set()
    if args.eval_manifest.exists():
        man = json.loads(args.eval_manifest.read_text(encoding="utf-8"))
        for im in man["images"]:
            (excluded_real if im["label"] == "real" else excluded_ai).add(im["row_offset"])
    print("Excluding {} real and {} ai row offsets already used in eval_set_v1".format(
        len(excluded_real), len(excluded_ai)))

    t0 = time.time()
    print("\nHarvesting {} authentic photographs ...".format(args.n_real))
    real = harvest(REAL_DATASET, None, args.n_real, rng, excluded_real,
                   "real", args.out, args.workers)

    print("\nHarvesting {} generated images ({} held out) ...".format(
        args.n_ai, GEN_COLUMNS[HELDOUT_COLUMN]))
    ai = harvest(AI_DATASET, TRAIN_COLUMNS + [HELDOUT_COLUMN], args.n_ai, rng,
                 excluded_ai, "ai", args.out, args.workers,
                 heldout_column=HELDOUT_COLUMN)

    records = real + ai
    counts = {}
    for r in records:
        counts.setdefault(r["split"], {}).setdefault(r["label"], 0)
        counts[r["split"]][r["label"]] += 1

    manifest = {
        "name": "undiffused-corpus-v1",
        "seed": args.seed,
        "generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "holdout_generator": GEN_COLUMNS[HELDOUT_COLUMN],
        "holdout_rationale": (
            "Detectors do not transfer across generator families. SDXL never "
            "appears in train or val, so the test_heldout split measures "
            "cross-generator generalisation rather than memorisation."),
        "train_generators": [GEN_COLUMNS[c] for c in TRAIN_COLUMNS],
        "excluded_eval_offsets": {"real": len(excluded_real), "ai": len(excluded_ai)},
        "counts_by_split": counts,
        "total": len(records),
        "elapsed_sec": round(time.time() - t0, 1),
        "images": records,
    }
    (args.out / "corpus_manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8")

    print("\n" + "=" * 60)
    print("corpus_v1: {} images in {:.0f}s".format(len(records), time.time() - t0))
    for split in sorted(counts):
        print("  {:<14s} {}".format(split, counts[split]))
    print("Wrote {}".format(args.out / "corpus_manifest.json"))


if __name__ == "__main__":
    main()
