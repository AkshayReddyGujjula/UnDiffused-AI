# v1 checkpoints (archived, not shipped)

The two ViT-Base/16 checkpoints the extension originally shipped. They are kept
here so `docs/benchmark/v1_baseline.json` stays reproducible, and they are
deliberately **outside `public/`** so the build no longer bundles them.

They are not used at runtime. Measured against 100 labelled images, every class
index of both models produced an AUROC whose 95% bootstrap interval contained
0.5, and the extension path built on them caught 0 of 50 generated images. See
`docs/benchmark/v1_baseline_note.md`.

Removing them from the bundle cuts roughly 174 MB from the extension package.

Their original provenance and licence were not recorded. They are retained only
as historical evidence for the measured v1 baseline and are not relicensed by
the repository's Apache 2.0 licence. Do not redistribute or use them outside
that evidentiary context without first establishing that you have the necessary
rights.

To reproduce the v1 baseline:

```bash
cd scripts/bench
python run_baseline.py --models ../../models/v1_archive
```
