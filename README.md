# UnDiffused

A Chrome extension that detects AI-generated images entirely on-device, and — more
to the point — a record of measuring a shipped model, finding it detected
nothing, and rebuilding it under an evaluation protocol strict enough to catch
its own replacement cheating.

Every number below is reproducible from the scripts in this repository, and the
unflattering ones are included on purpose.

---

## The result in one table

| | Model | Content-matched AUROC | Notes |
|---|---|---|---|
| **v1 (shipped)** | 2 × ViT-B/16, 174 MB | **0.50** | Caught 0 of 50 generated images |
| **v2 (this repo)** | DINOv2-S/14 + linear probe, 24.9 MB | **0.88–0.91** | Calibrated, abstains when unsure |

The v2 figure is measured on **content-matched pairs**: each real photograph is
paired with an AI image generated from that photograph's own caption, so subject
matter is held constant and only authenticity varies. That is a harder and more
honest test than the usual one, and the reason for it is the most interesting
part of this project.

---

## Three findings

### 1. The shipped model detected nothing

The extension had been shipping two 87 MB checkpoints with no provenance, no
label map, and no measured accuracy. Running them against 100 labelled images:

| Model | Class 0 | Class 1 | Class 2 |
|---|---|---|---|
| global (3-class) | 0.540 | 0.437 | 0.495 |
| local (2-class) | 0.520 | 0.480 | — |

**Every 95% bootstrap interval contains 0.5.** Through the real extension path
the pipeline caught **0 of 50** generated images and flagged 1 of 50
photographs — an accuracy of 0.490, achieved by calling almost everything real.

There was also a genuine bug: the output parser handled only the 1- and 2-class
cases, so the 3-class global model fell through to a branch that indexed
`outputData[i]` and read across both class and batch boundaries. But **fixing it
changed AUROC from 0.472 to 0.445.** Both are noise. The bug was concealing an
absence, not a capability — which is the unsatisfying answer, and the true one.

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
the corpus seam intact, so the shortcut transfers — every ELSA render still
looks like an ELSA render — and gets certified at 0.990.

| Trained on | Unmatched | Content-matched | Gap |
|---|---|---|---|
| Mismatched corpora | 0.980 | 0.659 | **0.32** |
| Content-matched pairs | 0.877 | 0.884 | **−0.008** |

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

---

## How it works now

**One model, one forward pass.** A frozen DINOv2-S/14 trunk, mean-pooled over
patch tokens, into a single linear layer. The feature scaler and the fitted
temperature are folded into that layer, so the graph emits a *calibrated* logit
and there is no class-index question to get wrong: `P(AI) = sigmoid(logits)`.

**Three states, not a percentage.** Below 0.545 → likely authentic. Above
0.846 → likely AI generated. Between → *inconclusive*, and the extension says
so. The band was fitted on validation against a 5% false-positive target under a
25% abstention ceiling fixed in advance. The measured cost is stated rather than
hidden: it abstains on about one image in four and catches roughly 70% of
generated images among those it rules on. Wrongly calling a genuine photograph
fake is the more damaging error, so the band is tuned to false-positive rate
rather than to accuracy.

**The contract is asserted at load time.** Tensor names, arity and class count
are checked against the graph, and a mismatch throws rather than degrading. The
metadata file is generated *from* the exported model, never written by hand —
the previous attempt at this declared input `"input"` and output `"output"` when
the real tensors were `pixel_values` and `logits`.

**It holds under laundering.** An image in the wild has been re-encoded, resized
or screenshotted several times before anyone right-clicks it, so every figure is
reported under those conditions too. Shipped int8 model, 400 content-matched
pairs never used in training:

| Transform | AUROC | ECE |
|---|---|---|
| none | 0.894 | 0.035 |
| normalized 512px q90 | 0.896 | 0.037 |
| JPEG q75 | 0.899 | 0.038 |
| JPEG q50 | 0.887 | 0.041 |
| JPEG q30 | 0.894 | 0.042 |
| double JPEG | 0.898 | 0.038 |
| resize chain | 0.898 | 0.033 |
| WebP q75 | 0.892 | 0.038 |
| screenshot re-capture | 0.896 | 0.023 |

The spread across all nine is 0.012 (full data: [docs/benchmark/v2_results.json](docs/benchmark/v2_results.json)). The stability is itself the evidence that
the model leans on global low-frequency structure rather than the
generator-specific high-frequency artifacts that recompression destroys.

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
python scripts/bench/train_matched_probe.py     # the v2 result
python scripts/train/export_probe_onnx.py --quantize
```

To train on a GPU, see **[docs/TRAINING_GUIDE.md](docs/TRAINING_GUIDE.md)**,
written for someone who has never trained a model before.

The evaluation protocol is fixed and versioned in
[`docs/benchmark/PROTOCOL.md`](docs/benchmark/PROTOCOL.md).

### Tests

```bash
npm test
```

12 regression tests, no new dependencies (Node's built-in runner). The central
one pins the output striding with four batch items whose dominant classes
differ, so an indexing error cannot pass by coincidence.

---

## Install the extension

```bash
npm install && npm run build
```

Then `chrome://extensions` → Developer mode → **Load unpacked** → select `dist/`.
Right-click any image → *Scan with UnDiffused*.

---

## What this does not do

Reliable universal detection of AI-generated images is an open research problem,
and this does not solve it. Published detectors lose more than twenty points
moving from curated benchmarks to real-world images.

Specific limits of the numbers here:

- **Two source corpora only** (COCO, ELSA_D3/LAION). Four generator families,
  all open-source diffusion — no Midjourney, no Firefly, no autoregressive
  models.
- **The "real" half of the matched set is LAION web imagery**, which includes
  graphics, product renders and screenshots. This makes the control
  conservative — label noise depresses the score — but it is not a clean
  photographic corpus.
- **A 25% abstention rate is real cost.** One image in four gets no answer.
- **~0.4–1.8 s per image** single-threaded WASM, plus a one-off session
  initialisation of roughly 30 s.
- **No C2PA verification yet.** Where provenance exists it should be read
  deterministically instead of estimated.

---

## Layout

```
src/content/inference/     contract.ts asserts the model interface; worker.ts runs it
scripts/bench/             evaluation: corpora, laundering, baselines, scoring
scripts/train/             GPU fine-tuning and verified ONNX export
scripts/verify/            cross-implementation and browser-runtime checks
docs/benchmark/            protocol, results, and the written findings
models/v1_archive/         the two dead checkpoints, kept for reproducibility
```
