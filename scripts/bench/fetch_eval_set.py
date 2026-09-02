"""
Stage 1 / step 1: assemble the v1 baseline evaluation set.

Authentic half : COCO val2017 (Flickr photographs collected 2014-2017, i.e.
                 predating public diffusion models -- authenticity is provable
                 by collection date rather than by inspection).
AI half        : ELSA_D3 (LAION prompts re-rendered by four generator families:
                 DeepFloyd IF-II-L, SD 1.4, SD 2.1-base, SDXL-base-1.0).

Images are fetched through the HuggingFace datasets-server rows API, which
serves decoded images as cached assets over plain HTTP. Everything lands inside
this repository under docs/benchmark/eval_set_v1/. Only the manifest (source
dataset, row offset, generator, sha256) is committed; the image bytes are
gitignored and re-fetchable by re-running this script with the same seed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import random
import sys
import time
from pathlib import Path

import requests

ROWS_API = "https://datasets-server.huggingface.co/rows"
UA = {"User-Agent": "UnDiffused-benchmark/1.0 (stage-1 baseline)"}

REAL_DATASET = {"dataset": "rafaelpadilla/coco2017", "config": "default", "split": "val"}
AI_DATASET = {"dataset": "elsaEU/ELSA_D3", "config": "default", "split": "train"}

# ELSA_D3 stores four renders per prompt, one per generator. We cycle across all
# four so the AI half is not a single generator family -- cross-generator
# behaviour is the whole point of the measurement.
AI_GEN_COLUMNS = ["image_gen0", "image_gen1", "image_gen2", "image_gen3"]


def fetch_rows(spec, offset, length, retries=4):
    params = dict(spec)
    params["offset"] = offset
    params["length"] = length
    last = None
    for attempt in range(retries):
        try:
            r = requests.get(ROWS_API, params=params, headers=UA, timeout=90)
            if r.status_code == 200:
                return r.json()
            last = "HTTP {}: {}".format(r.status_code, r.text[:200])
        except requests.RequestException as exc:
            last = repr(exc)
        time.sleep(2 * (attempt + 1))
    raise RuntimeError("rows API failed for {} @ {}: {}".format(spec, offset, last))


def download(url, dest, retries=4):
    """Fetch bytes to dest, return sha256 hex digest."""
    last = None
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=UA, timeout=120)
            if r.status_code == 200 and r.content:
                dest.write_bytes(r.content)
                return hashlib.sha256(r.content).hexdigest()
            last = "HTTP {}".format(r.status_code)
        except requests.RequestException as exc:
            last = repr(exc)
        time.sleep(2 * (attempt + 1))
    raise RuntimeError("download failed {}: {}".format(url[:80], last))


def collect_real(n, rng, out_dir):
    """COCO val2017 has 5000 rows; sample blocks at random offsets."""
    total = fetch_rows(REAL_DATASET, 0, 1)["num_rows_total"]
    records = []
    seen_offsets = set()

    while len(records) < n:
        block_start = rng.randrange(0, max(1, total - 100))
        rows = fetch_rows(REAL_DATASET, block_start, 100)["rows"]
        rng.shuffle(rows)
        for entry in rows:
            if len(records) >= n:
                break
            offset = entry["row_idx"]
            if offset in seen_offsets:
                continue
            img = entry["row"].get("image")
            if not isinstance(img, dict) or not img.get("src"):
                continue
            seen_offsets.add(offset)
            name = "real_{:03d}_coco{}.jpg".format(len(records), offset)
            try:
                digest = download(img["src"], out_dir / name)
            except RuntimeError as exc:
                print("  skip {}: {}".format(name, exc), file=sys.stderr)
                continue
            records.append({
                "file": name,
                "label": "real",
                "label_int": 0,
                "source_dataset": REAL_DATASET["dataset"],
                "source_split": REAL_DATASET["split"],
                "row_offset": offset,
                "generator": None,
                "provenance": "Flickr photograph, COCO 2017 collection (pre-diffusion)",
                "sha256": digest,
            })
            print("  [{:>2}/{}] {}".format(len(records), n, name))
    return records


def collect_ai(n, rng, out_dir):
    """ELSA_D3: take one render per row, cycling the generator column."""
    total = fetch_rows(AI_DATASET, 0, 1)["num_rows_total"]
    records = []
    seen_offsets = set()

    while len(records) < n:
        block_start = rng.randrange(0, max(1, total - 100))
        rows = fetch_rows(AI_DATASET, block_start, 100)["rows"]
        rng.shuffle(rows)
        for entry in rows:
            if len(records) >= n:
                break
            offset = entry["row_idx"]
            if offset in seen_offsets:
                continue
            row = entry["row"]
            # Round-robin so the four generators are near-evenly represented.
            col = AI_GEN_COLUMNS[len(records) % len(AI_GEN_COLUMNS)]
            img = row.get(col)
            if not isinstance(img, dict) or not img.get("src"):
                continue
            seen_offsets.add(offset)
            generator = row.get(col.replace("image_", "model_"))
            name = "ai_{:03d}_elsa{}_{}.jpg".format(len(records), offset, col[-4:])
            try:
                digest = download(img["src"], out_dir / name)
            except RuntimeError as exc:
                print("  skip {}: {}".format(name, exc), file=sys.stderr)
                continue
            records.append({
                "file": name,
                "label": "ai",
                "label_int": 1,
                "source_dataset": AI_DATASET["dataset"],
                "source_split": AI_DATASET["split"],
                "row_offset": offset,
                "generator": generator,
                "provenance": "text-to-image render by {}".format(generator),
                "sha256": digest,
            })
            print("  [{:>2}/{}] {}  <- {}".format(len(records), n, name, generator))
    return records


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-real", type=int, default=50)
    ap.add_argument("--n-ai", type=int, default=50)
    ap.add_argument("--seed", type=int, default=20260902)
    ap.add_argument("--out", type=Path, default=Path("docs/benchmark/eval_set_v1"))
    args = ap.parse_args()

    real_dir = args.out / "real"
    ai_dir = args.out / "ai"
    real_dir.mkdir(parents=True, exist_ok=True)
    ai_dir.mkdir(parents=True, exist_ok=True)

    rng = random.Random(args.seed)

    print("Fetching {} authentic photographs from {} ...".format(
        args.n_real, REAL_DATASET["dataset"]))
    real = collect_real(args.n_real, rng, real_dir)

    print("Fetching {} generated images from {} ...".format(
        args.n_ai, AI_DATASET["dataset"]))
    ai = collect_ai(args.n_ai, rng, ai_dir)

    manifest = {
        "name": "undiffused-eval-v1",
        "seed": args.seed,
        "counts": {"real": len(real), "ai": len(ai)},
        "sources": {"real": REAL_DATASET, "ai": AI_DATASET},
        "label_convention": {"0": "real / authentic photograph", "1": "ai / generated"},
        "images": real + ai,
    }
    manifest_path = args.out / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("\nWrote {} ({} real, {} ai)".format(manifest_path, len(real), len(ai)))


if __name__ == "__main__":
    main()
