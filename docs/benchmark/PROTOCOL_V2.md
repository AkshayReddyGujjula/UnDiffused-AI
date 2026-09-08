# UnDiffused benchmark protocol v2

> Status: protocol used for the shipping fine-tuned detector
>
> Primary result file: [`v2_finetuned_results.json`](v2_finetuned_results.json)
> Calibration file: [`v2_finetuned_calibration.json`](v2_finetuned_calibration.json)

## 1. Question

Can the exact quantised model shipped by UnDiffused rank generated images above
content-matched source images, including after common browser-era image
transformations?

The protocol is designed to test the deployment artefact, not the PyTorch
checkpoint, and to reduce semantic source-corpus shortcuts.

## 2. Label convention

| Label | Meaning |
|---:|---|
| `0` | LAION source image |
| `1` | ELSA_D3 image generated from the source image's alt-text |

A higher model logit is defined to mean more likely generated because the binary
head was trained with generated images as label `1`.

## 3. Content-matched unit

One pair contains a LAION source image and an ELSA_D3 generation created from
that image's caption. Both records share a `pair_id`.

Pairing does not make the images pixel-aligned. It controls approximate semantic
subject matter so a model cannot succeed simply because authentic images show a
different type of content from generated images.

All split operations happen at `pair_id` level. The two members of a pair never
appear on opposite sides of a train, validation or test boundary.

## 4. Corpus separation

| Corpus | Pairs | Images | Starting ELSA offset | Role |
|---|---:|---:|---:|---|
| `matched_corpus_v1` | 4,000 | 8,000 | 200,000 | training, validation and internal tests |
| `matched_control_v1` | 400 | 800 | 100,000 | untouched external measurement |

The non-overlapping offsets prevent the fetch command from reconstructing the
same ELSA records into both corpora. Every downloaded byte is checked against
the SHA-256 recorded in its manifest.

The canonical manifests are:

- [`matched_corpus_v1/manifest.json`](matched_corpus_v1/manifest.json)
- [`matched_control_v1/manifest.json`](matched_control_v1/manifest.json)

Remote URLs can disappear. A manifest proves identity when a file is available;
it does not guarantee permanent availability.

## 5. Generator splits

Training and validation include:

- Stable Diffusion v1.4;
- DeepFloyd IF-II-L;
- Stable Diffusion 2.1 Base.

Stable Diffusion XL is excluded as a generator family during training and
validation. The external set contains all four families and reports their AUROC
separately.

The held-out generator is evidence of transfer within this data construction.
It does not replace content matching and does not establish transfer to arbitrary
future generators.

## 6. Model under test

The primary result must be calculated from:

```text
public/models/detector_v2_finetuned_int8.onnx
```

Its tensor names and preprocessing values must match:

```text
public/models/detector_v2_finetuned_meta.json
```

The scorer exits if the graph's input and output names disagree with metadata.
The FP32 export and PyTorch checkpoint are intermediate artefacts and cannot be
used as substitutes for a shipping claim.

## 7. Preprocessing

Before inference, each transformed image is:

1. converted to RGB;
2. resized to 224 by 224 with PIL bicubic resampling;
3. converted to floating point in `[0, 1]`;
4. normalised with ImageNet mean `[0.485, 0.456, 0.406]` and standard deviation
   `[0.229, 0.224, 0.225]`;
5. transposed to NCHW layout.

PIL bicubic and browser Canvas resampling are not byte-identical. The benchmark
therefore measures the ONNX graph with a close preprocessing replica; the
separate browser check covers operator and TypeScript contract compatibility.

## 8. Transformation suite

Every external result is calculated for the following fixed suite:

| Key | Operation |
|---|---|
| `identity` | RGB conversion only |
| `normalize_512_q90` | resize to 512 by 512 with bicubic resampling, then JPEG q90 |
| `jpeg_q75` | JPEG round trip at quality 75 |
| `jpeg_q50` | JPEG round trip at quality 50 |
| `jpeg_q30` | JPEG round trip at quality 30 |
| `double_jpeg` | JPEG q85 followed by JPEG q70 |
| `resize_chain` | half-size bilinear downsample, bicubic restore, JPEG q85 |
| `webp_q75` | WebP round trip at quality 75 |
| `screenshot` | downscale longest side to at most 900 pixels, then JPEG q80 |

`normalize_512_q90` is also a compression-history control because both classes
leave it with the same dimensions and encoder history.

The implementation is [`scripts/bench/laundering.py`](../../scripts/bench/laundering.py).

## 9. Reported metrics

### AUROC

AUROC is the primary ranking metric. It measures whether generated images tend
to receive higher scores than source images without selecting one threshold.

### Stratified bootstrap interval

Each 95% interval uses 2,000 bootstrap samples. Positive and negative indices
are sampled separately with replacement. The scorer uses NumPy seed `4242`.

### Accuracy at 0.5

This is reported for raw sigmoid probabilities to describe the model output. It
is not the extension's final three-state policy.

### FPR at 95% TPR

This shows how many source images would be called generated at the threshold
needed to retain 95% of generated images.

### Expected calibration error

The scorer reports ten-bin ECE on raw sigmoid output. Calibrated ECE is computed
separately after applying the fitted temperature.

### Per-generator AUROC

For each generator, all 400 source images are compared with the generated images
from that family. These values are not independent because they share the same
source side.

## 10. Calibration protocol

Calibration is run after export on the exact shipping model.

1. Reconstruct the training run's validation split with the same seed and
   pair-safe split logic.
2. Fit temperature by minimising negative log-likelihood on validation logits.
3. Search a two-threshold abstention band against a 5% validation false-positive
   target and a 25% maximum abstention ceiling.
4. Freeze temperature and thresholds.
5. Apply them once to the external 400-pair set.

The external result is not used to move the thresholds. Both fitting-set and
external behaviour are retained in
[`v2_finetuned_calibration.json`](v2_finetuned_calibration.json).

## 11. Reproduction commands

Fetch non-overlapping corpora:

```bash
python scripts/bench/fetch_matched_control.py --pairs 4000 --start-offset 200000 --out docs/benchmark/matched_corpus_v1
python scripts/bench/fetch_matched_control.py --pairs 400 --start-offset 100000 --out docs/benchmark/matched_control_v1
```

Train and export:

```bash
python scripts/train/finetune_gpu.py
python scripts/train/export_onnx.py --name detector_v2_finetuned --quantize
```

Score the exact INT8 graph:

```bash
python scripts/bench/score_model.py \
  --model public/models/detector_v2_finetuned_int8.onnx \
  --meta public/models/detector_v2_finetuned_meta.json \
  --eval-sets docs/benchmark/matched_control_v1 \
  --out docs/benchmark/v2_finetuned_results.json
```

Fit calibration on validation and check it externally:

```bash
python scripts/bench/calibrate_onnx.py
```

## 12. Acceptance conditions for a public claim

A new result may replace the shipping headline only when:

- the exact extension-loaded graph is tracked and named in the result file;
- graph and metadata tensor names match;
- the 400-pair external set has not been used for training or model selection;
- identity and all eight laundering transforms are reported;
- a 95% interval accompanies the primary AUROC;
- calibrated external abstention, FPR and TPR are reported;
- browser WASM loads the graph and exercises the real contract parser;
- limitations and generator coverage are updated with the number.

## 13. Known limitations

- The external set contains 400 pairs from one matched construction.
- LAION source images include graphics, screenshots and product renders.
- Only four open-source diffusion families are covered.
- Transformations approximate common laundering but are not adversarial attacks.
- PIL preprocessing is close to, but not identical to, browser Canvas.
- Python dependency versions currently have lower bounds rather than a lock file.

These limits bound the claim; they do not justify changing the protocol after a
result is observed.
