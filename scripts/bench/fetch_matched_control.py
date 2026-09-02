"""
The decisive control: content-matched real and generated images.

The problem this solves. The feasibility probe scored ~0.91 AUROC separating
COCO photographs from ELSA renders, and that number held flat through every
laundering transform including JPEG q30 and a screenshot simulation. Flatness
that perfect is a warning rather than a triumph: generator artefacts are
high-frequency and should degrade under recompression. Semantic content does
not degrade. COCO is everyday scenes of common objects; ELSA prompts come from
LAION web alt-text, which skews to posters, product shots and news imagery. A
probe can separate those two populations perfectly without knowing anything
about how an image was made.

The fix. Each ELSA_D3 row carries a `url` field: the original LAION image whose
alt-text became the generation prompt. Downloading that image gives a real
photograph drawn from *the same content distribution* as the render sitting
beside it in the same row -- same subject, same style of scene, same corner of
the web. Content is held constant and only authenticity varies.

If the probe still scores ~0.9 here, it is detecting generation. If it falls
towards chance, the earlier number was measuring the seam between two corpora
and would have been a fabricated result.

Pairs are written only when both halves succeed, so the set stays exactly
balanced and matched.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image

ROWS_API = "https://datasets-server.huggingface.co/rows"
SPEC = {"dataset": "elsaEU/ELSA_D3", "config": "default", "split": "train"}

# A browser UA: many LAION hosts refuse obvious script clients.
BROWSER_UA = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}
HF_UA = {"User-Agent": "UnDiffused-benchmark/1.0 (matched control)"}

GEN_COLUMNS = {
    "image_gen0": "DeepFloyd/IF-II-L-v1.0",
    "image_gen1": "CompVis/stable-diffusion-v1-4",
    "image_gen2": "stabilityai/stable-diffusion-2-1-base",
    "image_gen3": "stabilityai/stable-diffusion-xl-base-1.0",
}
MIN_SIDE = 160


def get_image(url, headers, timeout=15):
    """Fetch and validate an image. Returns (bytes, size) or None.

    Validation is by decoding, not by Content-Type: the HuggingFace cached-asset
    endpoint serves perfectly good JPEGs as `binary/octet-stream`, and an
    earlier content-type check silently rejected every generated image and
    produced zero pairs.
    """
    try:
        r = requests.get(url, headers=headers, timeout=timeout)
        if r.status_code != 200 or not r.content:
            return None
        img = Image.open(io.BytesIO(r.content))
        img.verify()                                   # cheap integrity check
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if min(img.size) < MIN_SIDE:
            return None
        return r.content, img.size
    except Exception:
        return None


def fetch_pair(row_entry, gen_column, out_dir):
    """Download the LAION original and one render from the same row."""
    row = row_entry["row"]
    offset = row_entry["row_idx"]
    url = row.get("url")
    gen = row.get(gen_column)
    if not url or not isinstance(gen, dict) or not gen.get("src"):
        return None

    real = get_image(url, BROWSER_UA)
    if real is None:
        return None
    fake = get_image(gen["src"], HF_UA, timeout=45)
    if fake is None:
        return None

    real_name = "real_{}.jpg".format(offset)
    fake_name = "ai_{}_{}.jpg".format(offset, gen_column[-4:])
    (out_dir / "real" / real_name).write_bytes(real[0])
    (out_dir / "ai" / fake_name).write_bytes(fake[0])

    prompt = (row.get("original_prompt") or "")[:200]
    return [
        {"file": real_name, "label": "real", "label_int": 0, "row_offset": offset,
         "generator": None, "pair_id": offset, "size": list(real[1]),
         "prompt": prompt, "source_url": url,
         "sha256": hashlib.sha256(real[0]).hexdigest()},
        {"file": fake_name, "label": "ai", "label_int": 1, "row_offset": offset,
         "generator": GEN_COLUMNS[gen_column], "pair_id": offset,
         "size": list(fake[1]), "prompt": prompt, "source_url": None,
         "sha256": hashlib.sha256(fake[0]).hexdigest()},
    ]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pairs", type=int, default=400)
    ap.add_argument("--workers", type=int, default=24)
    ap.add_argument("--start-offset", type=int, default=100000)
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/matched_control_v1"))
    args = ap.parse_args()

    (args.out / "real").mkdir(parents=True, exist_ok=True)
    (args.out / "ai").mkdir(parents=True, exist_ok=True)

    records = []
    offset = args.start_offset
    gen_cycle = 0
    t0 = time.time()
    columns = list(GEN_COLUMNS)

    while len(records) < args.pairs * 2:
        try:
            page = requests.get(ROWS_API, params={**SPEC, "offset": offset,
                                                  "length": 100},
                                headers=HF_UA, timeout=90)
            if page.status_code != 200:
                time.sleep(4)
                offset += 100
                continue
            rows = page.json()["rows"]
        except requests.RequestException:
            time.sleep(4)
            continue
        offset += 100

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = []
            for entry in rows:
                col = columns[gen_cycle % len(columns)]
                gen_cycle += 1
                futures.append(pool.submit(fetch_pair, entry, col, args.out))
            for fut in as_completed(futures):
                pair = fut.result()
                if pair:
                    records.extend(pair)

        print("  {}/{} pairs  ({:.0f}s elapsed, offset {})".format(
            len(records) // 2, args.pairs, time.time() - t0, offset), flush=True)

    records = records[:args.pairs * 2]
    manifest = {
        "name": "undiffused-matched-control-v1",
        "purpose": ("Content-matched real/generated pairs. The real image is the "
                    "LAION original whose alt-text became the generation prompt, "
                    "so subject matter is held constant and only authenticity "
                    "varies. Isolates generation artefacts from semantic content."),
        "caveat": ("LAION originals are web images, not verified photographs: some "
                   "are graphics, renders or screenshots. This makes the control "
                   "conservative -- it can understate a real detector -- but it "
                   "cannot manufacture a signal that is not there."),
        "pairs": len(records) // 2,
        "total": len(records),
        "label_convention": {"0": "real (LAION original)", "1": "ai (ELSA render)"},
        "images": records,
    }
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2),
                                            encoding="utf-8")
    print("\nWrote {} pairs to {}".format(len(records) // 2, args.out))


if __name__ == "__main__":
    main()
