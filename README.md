# UnDiffused

A Chrome extension that detects AI-generated images entirely on-device. More to
the point, it is a record of measuring a shipped model, finding it detected
nothing, and rebuilding it under an evaluation protocol strict enough to catch
its own replacement cheating.

Every number below is reproducible from the scripts in this repository, and the
unflattering ones are included on purpose.

---

## The result in one table

| | Model | Content-matched AUROC | Notes |
|---|---|---|---|
| **v1 (shipped)** | 2 × ViT-B/16, 174 MB | **0.50** | Caught 0 of 50 generated images |
| **v2 probe** | DINOv2-S/14 + frozen linear probe, 24.9 MB | **0.894** | The first honest rebuild |
| **v2 fine-tuned (shipping)** | DINOv2-S/14, last blocks unfrozen, 24.9 MB | **0.954** | Calibrated, abstains when unsure |

Both v2 figures are measured on **content-matched pairs**: each real photograph is
paired with an AI image generated from that photograph's own caption, so subject
matter is held constant and only authenticity varies. That is a harder and more
honest test than the usual one, and the reason for it is the most interesting
part of this project.

---

## Four findings

### 1. The shipped model detected nothing

The extension had been shipping two 87 MB checkpoints with no provenance, no
label map, and no measured accuracy. Running them against 100 labelled images:

| Model | Class 0 | Class 1 | Class 2 |
|---|---|---|---|
| global (3-class) | 0.540 | 0.437 | 0.495 |
| local (2-class) | 0.520 | 0.480 | n/a |

**Every 95% bootstrap interval contains 0.5.** Through the real extension path
the pipeline caught **0 of 50** generated images and flagged 1 of 50
photographs, an accuracy of 0.490 achieved by calling almost everything real.

There was also a genuine bug: the output parser handled only the 1- and 2-class
cases, so the 3-class global model fell through to a branch that indexed
`outputData[i]` and read across both class and batch boundaries. But **fixing it
changed AUROC from 0.472 to 0.445.** Both are noise. The bug was concealing an
absence, not a capability. That is the unsatisfying answer, and the true one.

A sweep of 5 normalisations × 2 resize policies ruled out our own preprocessing
as the cause: the strongest deviation anywhere was 0.341, in the inverted
direction, consistent with noise at n=100.

→ [`docs/benchmark/v1_baseline_note.md`](docs/benchmark/v1_baseline_note.md)

### 2. A held-out generator certified a model that had learned nothing

The rebuild's first version scored **0.975** on an in-distribution test split and
**0.990** on SDXL, a generator held out of training entirely. That looked like a
solved problem.

It held *flat* under JPEG q30 and screenshot simulation. That was the tell:
generation artifacts are high-frequency and should degrade under recompression.
Semantic content does not.

The training data was COCO photographs versus ELSA renders. COCO is everyday
scenes; ELSA prompts come from LAION web alt-text, so its renders skew to
product shots, posters and badges. The model had learned **which dataset an
image came from**. On content-matched pairs it scored **0.659**.

A generator holdout cannot detect this. It holds out the generator while leaving
the corpus seam intact, so the shortcut transfers. Every ELSA render still looks
like an ELSA render, and the model gets certified at 0.990.

| Trained on | Unmatched | Content-matched | Gap |
|---|---|---|---|
| Mismatched corpora | 0.980 | 0.659 | **0.32** |
| Content-matched pairs | 0.877 | 0.884 | **-0.008** |

Same backbone, same head. **The training data, not the architecture, decided
whether it learned the shortcut or the signal.**

### 3. An export verified in Python still failed in the browser

The int8 model scored 0.894 under Python `onnxruntime` and could not load in a
browser at all:

```
Could not find an implementation for ConvInteger(10) node with name
'/trunk/embeddings/patch_embeddings/projection/Conv_quant'
```

`quantize_dynamic` quantizes Conv as well as MatMul, and `onnxruntime-web`'s
WASM backend has a `MatMulInteger` kernel but no `ConvInteger` kernel. Every
Python-side check passed. The fix is to quantize MatMul only, leaving the
patch-embedding Conv in fp32 at a cost of 0.7 MB.

An export verified only in the framework that produced it has not been verified
for the runtime it ships to.
[`scripts/verify/browser_check.html`](scripts/verify/browser_check.html) now
runs the shipped file under the real runtime.

### 4. Verification that bypasses the real code path proves nothing

The browser check above passed while the extension threw on every single scan.

The exported head ends in `.squeeze(-1)`, so ONNX reports the output as rank-1
`[batch]`. The parser required rank-2 and raised `ModelContractError` on every
image. The harness missed it because it read the raw output buffer directly
instead of calling the parser, so it was verifying the runtime and the weights
while stepping around the one piece of code most likely to be wrong.

The harness now imports the real contract module, which is also why the
abstention thresholds are no longer duplicated inside it.

The same lesson turned up twice more while preparing this repository. A
quantization guard in the probe exporter read a variable that was never
assigned, so it raised `NameError`; a broad `except` swallowed that and recorded
the quantization as failed while the int8 file sat on disk looking correct. And
the private-address guard in the background worker took three attempts to get
right, each failure now pinned by a test. Every one of these produced a
plausible-looking result rather than an error, which is the entire theme.

---

## How it works now

**One model, one forward pass.** A DINOv2-S/14 trunk with its last transformer
blocks unfrozen, mean-pooled over patch tokens, into a single linear layer. The
head emits one logit, so there is no class-index question to get wrong:
`P(AI) = sigmoid(logit / T)`.

The temperature `T = 1.9077` was fitted by NLL on the training run's own
validation split and lives on the model contract rather than in the parser,
because the two v2 models disagree about where calibration belongs: the frozen
probe folded its temperature into the exported graph, the fine-tune does not.
Binding the divisor to the model that needs it means repointing between them
cannot silently double-scale a probability. Temperature scaling is
rank-preserving, so it moves no AUROC. What it moves is the thresholds those
scores are read against, which is the entire reason the model was not shipped
until this was re-derived. Calibration cut expected calibration error from 0.061
to 0.022.

**Three states, not a percentage.** Below 0.210 → likely authentic. Above
0.648 → likely AI generated. Between → *inconclusive*, and the extension says
so. The band was fitted on the training run's validation split against a 5%
false-positive target under a 25% abstention ceiling fixed in advance.

What it actually does, measured on 800 pairs it was neither trained nor fitted
on:

| | Abstains | FPR | TPR |
|---|---|---|---|
| fitted on validation (n=750) | 15.9% | **4.97%** | 93.9% |
| measured external (n=800) | 14.3% | **6.88%** | 93.8% |

**The extension claims the 6.88%.** A band fitted to hit 5% delivers 6.9% on
data it has never seen, and quoting the 4.97% would be reporting a fitting-set
number as a deployment number: a smaller version of the failure this repository
exists to document. Re-fitting the band on the external set would recover the
advertised 5% and was rejected, because it would consume the only clean
measurement of the shipped thresholds in exchange for a nicer-sounding number.

Wrongly calling a genuine photograph fake is the more damaging error, so the
band is tuned to false-positive rate rather than to accuracy.

**The contract is asserted at load time.** Tensor names, arity and class count
are checked against the graph, and a mismatch throws rather than degrading. The
metadata file is generated *from* the exported model, never written by hand. The
previous attempt at this declared input `"input"` and output `"output"` when the
real tensors were `pixel_values` and `logits`.

**It holds under laundering.** An image in the wild has been re-encoded, resized
or screenshotted several times before anyone right-clicks it, so every figure is
reported under those conditions too. Shipped int8 model, 400 content-matched
pairs never used in training:

| Transform | AUROC | ECE (uncalibrated) |
|---|---|---|
| none | 0.954 | 0.071 |
| normalized 512px q90 | 0.956 | 0.065 |
| JPEG q75 | 0.955 | 0.068 |
| JPEG q50 | 0.948 | 0.083 |
| JPEG q30 | 0.950 | 0.080 |
| double JPEG | 0.958 | 0.067 |
| resize chain | 0.954 | 0.072 |
| WebP q75 | 0.951 | 0.075 |
| screenshot re-capture | 0.957 | 0.065 |

The spread across all nine is 0.010 (full data:
[docs/benchmark/v2_finetuned_results.json](docs/benchmark/v2_finetuned_results.json)).
The ECE column is measured on the raw sigmoid, before temperature scaling; after
calibration it is **0.022** on the untransformed set. The AUROC stability is
itself the evidence that the model leans on global low-frequency structure
rather than the generator-specific high-frequency artifacts that recompression
destroys.

Per generator on the same set, with SDXL held out of training entirely:

| Generator | AUROC |
|---|---|
| stable-diffusion-v1-4 | 0.941 |
| DeepFloyd IF-II-L | 0.952 |
| stable-diffusion-2-1-base | 0.963 |
| stable-diffusion-xl (held out) | 0.962 |

---

## Reproducing

```bash
pip install -r requirements.txt
```

```bash
python scripts/bench/fetch_eval_set.py          # 100 labelled images
cd scripts/bench && python run_baseline.py      # the v1 result: 0.50
```

```bash
python scripts/bench/fetch_matched_control.py --pairs 4000 --out docs/benchmark/matched_corpus_v1
python scripts/bench/extract_features.py --eval-dir docs/benchmark/matched_corpus_v1 --eval-name matched_corpus_v1
python scripts/bench/train_matched_probe.py     # the v2 probe: 0.894
python scripts/train/export_probe_onnx.py --quantize
```

The shipping model is a GPU fine-tune of the same backbone, calibrated
separately because its exported graph emits a raw logit:

```bash
python scripts/train/finetune_gpu.py            # ~35 min on a GTX 1660 Ti
python scripts/train/export_onnx.py --quantize
python scripts/bench/score_model.py --model public/models/detector_v2_finetuned_int8.onnx --meta public/models/detector_v2_finetuned_meta.json --eval-sets docs/benchmark/matched_control_v1
python scripts/bench/calibrate_onnx.py          # temperature and abstention band
```

To train on a GPU, see **[docs/TRAINING_GUIDE.md](docs/TRAINING_GUIDE.md)**,
written for someone who has never trained a model before.

The evaluation protocol is fixed and versioned in
[`docs/benchmark/PROTOCOL.md`](docs/benchmark/PROTOCOL.md).

### Tests

```bash
npm test
```

31 regression tests, no new dependencies (Node's built-in runner). The central
one pins the output striding with four batch items whose dominant classes
differ, so an indexing error cannot pass by coincidence. Others pin the
temperature divisor to its contract, so a model swap cannot double-apply
calibration; pin the abstention band to reporting its external measurement
rather than its fitting-set one; reject a non-finite logit rather than letting
it render as a confident verdict; and cover the background worker's private
address guard against the encodings that defeat a naive one, including
`2130706433` and `::ffff:7f00:1`, both of which are `127.0.0.1`.

---

## Install the extension

```bash
npm install && npm run build
```

Then `chrome://extensions` → Developer mode → **Load unpacked** → select `dist/`.
Right-click any image → *Scan with UnDiffused*.

---

## Privacy and permissions

Inference is entirely local. The model file ships inside the extension, runs on
`onnxruntime-web` under WASM, and no image, score or verdict leaves the machine.
There is no telemetry, no analytics and no remote endpoint of any kind.

The one component with real privilege is the background service worker, which
holds host permissions for every `http(s)` origin so it can fetch an image the
page will not hand over directly. That fetch is bound by neither CORS nor the
page's origin, and the URL comes from whatever the user right-clicked, so it is
gated by [`src/background/urlGuard.ts`](src/background/urlGuard.ts): loopback,
private, link-local, CGNAT and cloud metadata addresses are refused, in every
encoding the URL parser accepts, and the host is re-checked after redirects
before any response body is read. Outbound requests send no credentials. The
scan UI lives in a closed shadow root so the host page cannot read the verdict
back out.

---

## What this does not do

Reliable universal detection of AI-generated images is an open research problem,
and this does not solve it. This repository measures one model on one deliberately
difficult protocol; it does not establish performance on arbitrary generators or
real-world distributions.

Specific limits of the numbers here:

- **Two source corpora only** (COCO, ELSA_D3/LAION). Four generator families,
  all open-source diffusion: no Midjourney, no Firefly, no autoregressive
  models.
- **The "real" half of the matched set is LAION web imagery**, which includes
  graphics, product renders and screenshots. Label noise depresses the score, so
  this makes the control conservative rather than inflated, but it is not a
  clean photographic corpus.
- **A 14% abstention rate is real cost.** About one image in seven gets no
  answer, and the measured false-positive rate on images it does rule on is
  6.9%, not the 5% the band was fitted to.
- **~0.7 to 0.9 s per image** single-threaded WASM, measured in-browser, plus a
  one-off session initialisation of ~1.4 s warm (up to ~30 s on a cold cache
  while the 25 MB graph is fetched and optimised).
- **No C2PA verification yet.** Where provenance exists it should be read
  deterministically instead of estimated.

---

## Layout

```
src/content/inference/     contract.ts asserts the model interface; worker.ts runs it
src/background/urlGuard.ts admission control for the one privileged fetch
scripts/bench/             evaluation: corpora, laundering, baselines, scoring
scripts/train/             GPU fine-tuning, calibration and verified ONNX export
scripts/verify/            cross-implementation and browser-runtime checks
tests/                     31 regression tests over the contract and the guard
docs/benchmark/            protocol, results, and the written findings
docs/TRAINING_GUIDE.md     reproducing the model from scratch on one GPU
models/v1_archive/         the two dead checkpoints, kept for reproducibility
```

---

## Licence

Copyright 2026 Akshay Reddy Gujjula. Licensed under the
[Apache License 2.0](LICENSE).

The shipped detector is derived from Apache-2.0-licensed DINOv2 weights. Other
dependencies and the archived v1 checkpoints retain their own terms; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Image corpora are not committed. Their manifests are, pinning every source URL
and SHA-256, so `scripts/bench/fetch_matched_control.py` reconstructs them
byte-for-byte.
