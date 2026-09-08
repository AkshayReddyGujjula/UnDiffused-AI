# Engineering journey

UnDiffused began as a product prototype in February 2026. The extension looked
convincing before its detector had been measured. The most valuable work came
later: turning that prototype into a system where each public claim traces to a
shipping artefact, an evaluation set and a failure-aware runtime path.

This is a curated project history, not a cleaned-up success story. The failed
models, confounded metric and browser-only breakages are included because they
explain the architecture that exists now.

## Timeline

| Date | Phase | Outcome |
|---|---|---|
| 6 to 14 February 2026 | Product prototype | Chrome extension, draggable scanner, context-menu flow, forensic tools and dual-model pipeline |
| 14 May 2026 | First inference redesign | Correctness work on output parsing, fusion and crop selection |
| 2 September 2026 | Measurement before replacement | v1 measured at chance; parser bug isolated from model quality |
| 2 September 2026 | Shortcut discovery | 0.990 held-out-generator result fell to 0.659 under content matching |
| 2 to 3 September 2026 | Measured rebuild | DINOv2 probe trained on matched pairs reached 0.884 to 0.894 depending on the held-out set |
| 3 September 2026 | Browser deployment | 24.9 MB ONNX detector, calibrated abstention and real runtime verification |
| 3 September 2026 | Fine-tuning and hardening | Fine-tuned model reached 0.954 external AUROC; security and publication pass completed |
| 8 September 2026 | Public architecture edition | Repository reorganised around architecture, model evidence, decisions, security and reproducibility |

## Phase 1: build the interaction model

The February prototype established the product shape:

- a right-click action on any image;
- a movable scanner panel injected into the page;
- a popup for local image selection;
- whole-image and crop-based analysis;
- a forensic workspace with visual tools;
- reverse-image search and downloadable outputs.

The extension was already a useful front-end and browser-engineering project,
but the detector itself lacked the evidence needed for a public claim. Two
quantised ViT-B/16 checkpoints occupied about 174 MB. Their provenance, label
mapping and accuracy were not recorded.

The later project did not discard the product. It replaced the unmeasured centre
with a model and evaluation process that could survive scrutiny.

## Phase 2: measure v1 exactly as it shipped

The first audit started with a simple question: what do the two existing models
actually predict?

I created a 100-image labelled set, ran each output class independently and
reproduced the extension path in Python. The result was decisive:

| Model or path | AUROC or observed behaviour |
|---|---|
| Global checkpoint, best output index | 0.540, with confidence interval crossing chance |
| Local checkpoint, best output index | 0.520, with confidence interval crossing chance |
| Extension path | caught 0 of 50 generated images and flagged 1 of 50 authentic images |

Every class-index confidence interval contained 0.5. The extension's 0.490
accuracy came from calling almost everything authentic.

### The parser bug was real, but not the explanation

The three-class global model was parsed by logic that only handled one- and
two-class outputs correctly. Flat indexing crossed batch and class boundaries.
I fixed the parser and then re-ran the same set.

The extension-path AUROC moved from 0.472 to 0.445. Both values were noise. The
bug mattered as software correctness, but fixing it did not recover a detector.
The model itself carried no useful signal.

That distinction changed how I approached the rest of the project: never turn a
code defect into an accuracy story unless the measurement supports it.

Evidence:

- [`v1_baseline_note.md`](benchmark/v1_baseline_note.md)
- [`v1_baseline.json`](benchmark/v1_baseline.json)
- commit [`91b562a`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/91b562a)
- parser correction [`523f007`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/523f007)

## Phase 3: build a stronger baseline and watch it cheat

DINOv2 was selected as a compact, strong visual representation suitable for a
browser-oriented student project. A frozen feature extractor and linear probe
made it cheap to test whether the data contained a usable signal before paying
for GPU fine-tuning.

The first result looked exceptional:

- 0.975 AUROC on the in-distribution test split;
- 0.990 AUROC on SDXL, which had been excluded from training;
- little degradation under JPEG compression and screenshot simulation.

The robustness was suspicious. High-frequency generator artefacts should be
affected by repeated encoding. Semantic content is much more stable.

### Finding the corpus seam

The real images came from COCO and the generated images from ELSA_D3, whose
prompts came from LAION alt-text. COCO contains many everyday photographic
scenes. ELSA contains more web-style product images, graphics and badges. The
model could learn where an image came from instead of whether it was generated.

I fetched matched pairs where a LAION image and an ELSA generation shared the
same caption. On that control, the apparently excellent model fell to 0.659
AUROC.

Holding out SDXL had not removed the shortcut because the source-corpus seam was
still present on both sides of the generator split.

Evidence:

- [`confound_probe.json`](benchmark/confound_probe.json)
- [`matched_control_probe.json`](benchmark/matched_control_probe.json)
- commit [`c5dfb9b`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/c5dfb9b)

## Phase 4: redesign the data before the model

The next experiment kept the DINOv2 backbone and changed the training problem.
Each authentic image was paired with a generation based on its own caption, and
the pair identifier became the unit of splitting.

This prevented the authentic and generated forms of the same subject from
leaking across train, validation and test boundaries.

The matched-trained probe reached:

| Split | AUROC |
|---|---:|
| Content-matched test | 0.8845 |
| Held-out SDXL matched split | 0.9076 |
| Old unmatched evaluation | 0.8768 |

The matched and unmatched figures were now close. The headline number was lower
than 0.990, but it described the intended task.

Evidence:

- [`v2_matched_probe.json`](benchmark/v2_matched_probe.json)
- commit [`33524b7`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/33524b7)

## Phase 5: make the browser part of the model contract

The first quantised v2 export worked in Python and failed in the browser:

```text
Could not find an implementation for ConvInteger
```

Unrestricted dynamic quantisation had converted the patch-embedding convolution
to `ConvInteger`. Python ONNX Runtime supported that operator; the browser WASM
backend did not.

The fix was to quantise MatMul operators only. Keeping the patch-embedding
convolution in FP32 cost about 0.7 MB and produced a 24.9 MB model that the
shipping runtime could load.

Commit:
[`a29cb11`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/a29cb11)

### A browser smoke test still missed the extension failure

The repaired model loaded and produced sensible raw outputs in a browser test,
but the extension rejected every scan. ONNX described the one-logit output as
rank 1, `[batch]`, while the TypeScript parser required rank 2.

The smoke test had read the raw output buffer directly and bypassed the parser.
It proved that WASM could execute the graph, not that the extension could use
the result.

I changed the harness to import the real contract module and corrected the
rank-one output handling. The test boundary now includes the code most likely to
fail during a model swap.

Commit:
[`bacb767`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/bacb767)

## Phase 6: fine-tune, calibrate and keep the external set clean

The final detector unfroze the last four DINOv2 blocks and trained on 4,000
matched pairs. The exported INT8 graph was then measured on a separate 400-pair
matched set across four generator families.

| Result | Measurement |
|---|---:|
| External AUROC | 0.9543 |
| 95% bootstrap interval | 0.9400 to 0.9668 |
| Calibrated ECE | 0.0222 |
| Laundering range | 0.9479 to 0.9577 AUROC |

Temperature scaling and the two abstention thresholds were fitted on validation,
not on the external set. The fitted band reached a 4.97% false-positive rate on
validation and 6.88% on decided authentic images externally.

I kept the external figure. Re-fitting after seeing it would have spent the only
clean check of the shipping thresholds to recover a nicer number.

Commit:
[`3e6ab35`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/3e6ab35)

## Phase 7: harden the product boundary

The model was no longer the only meaningful risk. The background worker has host
permissions because it must retrieve selected images that page CORS rules can
block. The selected URL comes from an untrusted page.

The publication pass added:

- sender identity checks on extension messages;
- top-frame-only injection and messaging;
- no-credential fetches;
- blocks for literal loopback, private, link-local, CGNAT, metadata and reserved
  IPv6 destinations;
- final redirect destination validation before reading a body;
- closed Shadow DOM isolation;
- non-finite output rejection;
- non-fatal evidence-crop failure handling;
- test coverage for alternate loopback encodings such as `2130706433` and
  `::ffff:7f00:1`.

Commit:
[`9f2cc22`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/9f2cc22)

The remaining DNS and response-size limitations are stated in
[Architecture](ARCHITECTURE.md) and [Security policy](../SECURITY.md).

## What I would do next

The next improvements are about coverage and operational discipline, not making
the existing metric larger:

1. add C2PA verification and make deterministic provenance the first signal;
2. resolve hostnames before privileged retrieval and add response byte, time,
   MIME and dimension limits;
3. replace generated browser test cases with a small redistributable fixture set;
4. add external generators and more varied authentic sources;
5. measure the forensic tools separately or keep them explicitly qualitative;
6. cancel timed-out worker jobs rather than only rejecting the caller;
7. lock the Python environment for exact long-term reproduction.

## Lessons that now define the repository

### A generator holdout is not automatically a fair test

If real and generated samples come from visibly different corpora, a new
generator can preserve the same shortcut. Content controls matter more than an
impressive split name.

### The deployment runtime is part of the model

PyTorch, Python ONNX Runtime and browser WASM have different contracts and
operator support. The useful artefact is the graph that the extension can load,
parse and evaluate, not the checkpoint in the training framework.

### Calibration is a product decision

AUROC says how well scores rank examples. It does not say where the interface
should make a decision. The false-positive cost and abstention policy belong in
the documented system design.

### Negative results make the final result more credible

The v1 failure and 0.990 shortcut result are not embarrassing footnotes. They
are the evidence that the current protocol was designed to catch plausible but
wrong conclusions.

## Commit index

| Milestone | Commit |
|---|---|
| Measure the shipping v1 checkpoints | [`91b562a`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/91b562a) |
| Correct N-class parsing and assert the contract | [`523f007`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/523f007) |
| Add laundering and confound controls | [`c5dfb9b`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/c5dfb9b) |
| Show the held-out generator was measuring content | [`1075618`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/1075618) |
| Train on content-matched pairs | [`33524b7`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/33524b7) |
| Ship the first v2 probe | [`04728ad`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/04728ad) |
| Repair browser-incompatible quantisation | [`a29cb11`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/a29cb11) |
| Exercise the real parser in the browser check | [`bacb767`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/bacb767) |
| Ship fine-tuned calibration | [`3e6ab35`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/3e6ab35) |
| Harden the privileged fetch and output path | [`9f2cc22`](https://github.com/AkshayReddyGujjula/UnDiffused-AI/commit/9f2cc22) |
