"""Generate ignored browser smoke-test cases from a fetched matched corpus.

The browser harness needs data URLs because the benchmark image bytes are not
committed. This helper makes that dependency explicit and reproducible after
the canonical external set has been fetched.
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
from pathlib import Path


def to_data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return "data:{};base64,{}".format(mime, encoded)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--eval-dir",
        type=Path,
        default=Path("docs/benchmark/matched_control_v1"),
    )
    parser.add_argument("--per-class", type=int, default=3)
    parser.add_argument(
        "--out", type=Path, default=Path("scripts/verify/cases.js")
    )
    args = parser.parse_args()

    if args.per_class < 1:
        raise SystemExit("--per-class must be at least 1")

    manifest_path = args.eval_dir / "manifest.json"
    if not manifest_path.exists():
        raise SystemExit(
            "Missing {}. Fetch the external matched corpus first.".format(
                manifest_path
            )
        )

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    selected = []
    counts = {"real": 0, "ai": 0}

    for record in manifest["images"]:
        label = record["label"]
        if label not in counts or counts[label] >= args.per_class:
            continue

        path = args.eval_dir / label / record["file"]
        if not path.exists():
            raise SystemExit(
                "Missing {}. Re-fetch the external matched corpus.".format(path)
            )

        selected.append(
            {
                "name": str(record.get("pair_id") or record["file"]),
                "label": label,
                "url": to_data_url(path),
            }
        )
        counts[label] += 1
        if all(value == args.per_class for value in counts.values()):
            break

    if any(value < args.per_class for value in counts.values()):
        raise SystemExit(
            "Manifest did not contain {} available records per class.".format(
                args.per_class
            )
        )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    payload = "window.__CASES__ = {};\n".format(
        json.dumps(selected, ensure_ascii=True, separators=(",", ":"))
    )
    args.out.write_text(payload, encoding="utf-8")
    print("wrote {} cases to {}".format(len(selected), args.out))


if __name__ == "__main__":
    main()
