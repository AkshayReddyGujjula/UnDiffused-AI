# Third-party notices

UnDiffused is licensed under Apache 2.0, as described in `LICENSE`. That licence
applies to this repository's original work. Third-party software, model weights,
and datasets remain subject to their own terms.

## DINOv2

The shipped detector was initialized from `facebook/dinov2-small`. Meta's
DINOv2 code and model weights are released under Apache 2.0:

- https://github.com/facebookresearch/dinov2
- https://huggingface.co/facebook/dinov2-small

## JavaScript runtime dependencies

The extension directly depends on ONNX Runtime Web, React, and React DOM. The
build uses Vite and related development tooling. Their exact versions and full
transitive dependency graph are pinned in `package-lock.json`; each package's
licence metadata is recorded there. The directly used packages are MIT licensed
at the versions currently pinned.

## Datasets

Image bytes are not redistributed by this repository. Dataset manifests record
source URLs, labels, generator identifiers, pair identifiers, and SHA-256 hashes
so the experiments can be reconstructed. Users who run the fetch scripts are
responsible for complying with the source datasets' terms.

## Archived v1 checkpoints

The two checkpoints under `models/v1_archive/` predate the audit. Their original
provenance and licence were not recorded. They are retained only to make the
negative v1 benchmark reproducible and are not relicensed under Apache 2.0. See
`models/v1_archive/README.md` before using or redistributing them.
