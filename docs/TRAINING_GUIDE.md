# Training guide

How to reproduce the shipped detector from scratch on a single consumer GPU.

Written assuming no prior experience training a model. Every command is meant to
be copied and pasted exactly. If something goes wrong, jump to
[When something breaks](#when-something-breaks); the common failures are all
listed with their fixes.

**Time:** about 2 hours, most of it waiting.
**Hardware this was done on:** a GTX 1660 Ti, 6 GB.

The reference run took 8 epochs at roughly 4.3 minutes per epoch, and the best
epoch was number 5.

---

## Step 1: check the GPU is visible

A GPU that Windows can see is not automatically a GPU that PyTorch can use.
Check it before doing anything else:

```bash
nvidia-smi
```

You should see a table with `NVIDIA GeForce GTX 1660 Ti` and a memory figure
around 6144MiB. If the command is not found, the NVIDIA driver is not installed.
Install it from nvidia.com, reboot, and try again.

---

## Step 2: install the Python packages

This is the step most likely to go wrong, for two separate reasons.

**First: the default PyTorch install on Windows is CPU-only.** Installing it the
obvious way gives a build that ignores the card entirely and trains at roughly
one epoch per hour.

Install from the CUDA index instead:

```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
```

`cu126` (CUDA 12.6) is the right choice on any supported Python: it is the only
index that currently carries Windows wheels for Python 3.14, and it supports the
1660 Ti's Turing architecture. Do **not** use `cu121`, which stops at Python
3.13.

**Second: an old driver silently blocks CUDA 12.6.** If `nvidia-smi` reported a
driver older than about 525, update it from nvidia.com before installing.

Then the rest:

```bash
pip install transformers safetensors onnx onnxruntime scikit-learn scipy pillow requests numpy
```

Now verify PyTorch can actually see the card. This is the single most important
check in this guide:

```bash
python -c "import torch; print('CUDA available:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'NONE')"
```

It must print:

```
CUDA available: True
GPU: NVIDIA GeForce GTX 1660 Ti
```

**If it says `False`, stop.** Continuing means training on the CPU and waiting
all day. Go to [When something breaks](#when-something-breaks).

---

## Step 3: get the training images

The image files are not in git, because they would bloat the repository. Only
the manifest is committed, which pins every source URL and SHA-256, so the
corpus is reproducible without being stored. This script re-fetches it:

```bash
python scripts/bench/fetch_matched_control.py --pairs 4000 --out docs/benchmark/matched_corpus_v1
```

### What these images are, and why it matters

Each pair is one real photograph from the web and one AI image generated from
that photograph's own caption. **Same subject, one real, one generated.**

This matters more than it sounds. The first attempt at this trained on ordinary
photographs against AI images from a different source and scored 0.99, which
looked excellent and was almost entirely an artifact. The model had learned that
two piles of images came from different websites, not that one of them was
generated. Matching the content removes that shortcut. The scores below are
lower than 0.99, and they are the real ones.

---

## Step 4: train

**First, a 2-minute smoke test.** This runs every stage of the pipeline on a
tiny subset, so any crash happens now rather than 40 minutes into a real run:

```bash
python scripts/train/finetune_gpu.py --limit-pairs 24 --epochs 2 --batch-size 8 --out models/_smoketest
```

It should print two epochs and `Checkpoint: models\_smoketest\detector_best.pt`.
If it does, delete that folder and continue. If it errors, fix that before
starting the real run.

Then the real thing:

```bash
python scripts/train/finetune_gpu.py --epochs 8 --batch-size 16
```

**Roughly 35 minutes on the 1660 Ti.**

You will see one line per epoch:

```
epoch  1  loss 0.6012  val AUROC 0.7431  acc 0.681  (214s)
epoch  2  loss 0.5233  val AUROC 0.7902  acc 0.715  (211s)
```

### How to read this

- **AUROC** is the number that matters. It is the chance the model rates a
  random AI image as more suspicious than a random real one. **0.5 means
  useless** (a coin flip); 1.0 means perfect. The model that originally shipped
  scored 0.50, meaning nothing at all.
- **loss** should generally fall. Small bounces are normal.
- **val AUROC** should rise, then flatten. When it flattens, it has stopped
  learning.

**What counts as success:** anything meaningfully above **0.884**, which is what
the frozen linear probe achieved without fine-tuning. The reference run reached
0.9696 on validation.

**If `val AUROC` rises and then starts falling**, that is overfitting, meaning
the model is memorising. It is not a problem here: the script only ever saves
the best epoch, so the saved file predates the decline.

At the end it prints the final scores. The reference run:

```
val            AUROC 0.9696
test           AUROC 0.9602
test_heldout   AUROC 0.9720
```

`test_heldout` is the important one. It is SDXL, a generator the model **never
saw during training**. It tells you whether the model learned something general
or merely memorised the three generators it was shown.

---

## Step 5: convert the model for the browser

```bash
python scripts/train/export_onnx.py --checkpoint models/v2/detector_best.pt --name detector_v2_finetuned --quantize
```

This converts the model to ONNX, which is the format the extension runs, makes a
compressed int8 version, and **checks the conversion did not change the model's
answers**. It prints:

```
max |torch - onnx| over 8 samples: 1.2e-06
export verified
```

That number must be small. If it prints `EXPORT VERIFICATION FAILED`, do not
ship that file.

You may also see:

```
QUANT_WARN: int8 diverges from fp32 by 0.486 on probe tensors.
```

**This is not a failure, but do not ignore it.** Compressing to int8 changes the
model's answers slightly, and that warning says the change is not tiny. It is
measured on random tensors, which exaggerates it, and the frozen probe warned
the same way and still scored 0.894. The point is that quantization loss has to
be *measured* rather than assumed, which is Step 6.

The export also refuses to write a file containing `ConvInteger`, an operation
that works in Python and does not exist in the browser's runtime. That bug
shipped once already; see finding 3 in the README.

It writes into `public/models/`:

- `detector_v2_finetuned.onnx`, full size, gitignored because it is a
  regenerable intermediate that nothing loads at runtime
- `detector_v2_finetuned_int8.onnx`, compressed, roughly 4x smaller, and the
  file that actually ships
- `detector_v2_finetuned_meta.json`, the model's specification, **read from the
  exported file rather than typed by hand.** Hand-written metadata is how the
  original bug survived as long as it did.

---

## Step 6: score it properly

First fetch the held-out evaluation set. It is **not** the training corpus. It is
gitignored, and it is drawn from a different slice of the source data (offset
100000 against the training corpus's 200000), so the model has never seen any of
it. It is also the exact set the frozen probe scored 0.894 on, which is what
makes the comparison fair. About 4 minutes:

```bash
python scripts/bench/fetch_matched_control.py --pairs 400 --out docs/benchmark/matched_control_v1
```

Then score the **int8** file against it. Keep this on one line: the `--eval-sets`
path must be given explicitly, because the default resolves relative to
`scripts/bench` rather than the repository root.

```bash
cd scripts/bench && python score_model.py --model ../../public/models/detector_v2_finetuned_int8.onnx --meta ../../public/models/detector_v2_finetuned_meta.json --eval-sets ../../docs/benchmark/matched_control_v1 --out ../../docs/benchmark/v2_finetuned_results.json; cd ../..
```

If it prints `skipping ... (no manifest)`, the eval set was not found, meaning
the fetch above did not finish or the `--eval-sets` path is wrong. Re-run the
fetch.

Score the **int8** file, because that is the one that ships. Scoring the fp32
file tells you about something nobody will ever run.

This runs the model against the benchmark including the laundering tests, which
measure what happens when an image is re-compressed, resized, or screenshotted.
It takes about 15 minutes.

**This is the number worth quoting, not the training-screen number.** The
reference run scored **0.9543** here, against the frozen probe's 0.894.

If the fine-tuned int8 model scores lower, keep the probe. A fine-tune that
loses to a frozen linear probe is a legitimate result to report, not a failure
to hide.

---

## Step 7: re-derive the calibration

**Do not skip this.** A better AUROC does not entitle a model to the previous
model's thresholds.

AUROC is rank-based, so it is invariant to any monotonic rescaling of the
scores. The three-state thresholds are not. They were fitted to one specific
score distribution, and a new model has a different one. Shipping new weights
behind old thresholds produces a genuinely better detector attached to wrong
verdict labels and a false stated false-positive rate.

```bash
python scripts/bench/calibrate_onnx.py
```

About 5 minutes. It reconstructs the exact training validation split, using the
same seed and the same `pair_id` grouping as `finetune_gpu.py`, so the data it
fits on is genuinely held out from training. Then it:

1. fits a temperature `T` by minimising negative log-likelihood, so that
   `sigmoid(logit / T)` tracks observed frequencies
2. picks the abstention band against a 5% false-positive target under a 25%
   abstention ceiling fixed in advance
3. reports what that band actually does on `matched_control_v1`, which is
   external to both training and the fit

The reference run:

```
temperature: 1.9077
val AUROC: 0.9583  ECE raw 0.0608 -> calibrated 0.0237
band (fitted on val): low 0.2102, high 0.6482, abstain 0.1587, fpr 0.0497, tpr 0.9385
external AUROC 0.9543  ECE 0.0222
external band behaviour: abstain 0.1425, fpr 0.0688, tpr 0.9377
```

Note the gap in the last two lines. The band was fitted to hit 5% and delivers
6.88% on data it has never seen. **The external number is the one to publish.**
Quoting the 4.97% would be reporting a fitting-set number as a deployment
number.

---

## Step 8: ship it

Three files carry the model's identity, and all three have to agree.

1. **`src/content/inference/contract.ts`.** Set `DETECTOR_V2.name` and
   `temperature` to the fitted value, set `ABSTENTION_BAND.low` and `.high`, and
   put the *external* measurements in the `measured*` fields with the validation
   fit in `fittedOnVal`. Update `DETECTOR_V2_CALIBRATION` from the score file.

   The temperature belongs on the contract, not inside the parser. The frozen
   probe folds its temperature into the exported graph and the fine-tune does
   not, so a bare divisor in `logitsToAiProbabilities` would double-apply it the
   moment anyone repointed at the probe, silently, because the result stays
   inside [0, 1] and still renders.

2. **The model path**, in `src/content/inference/pipeline.ts` and in
   `manifest.json` under `web_accessible_resources`.

3. **`scripts/verify/browser_check.html`**, which reads the same path.

Then rebuild and re-verify:

```bash
npm test && npm run build && npm run verify:bundle
```

`npm run verify:bundle` is easy to forget and matters:
`scripts/verify/contract.mjs` is gitignored and regenerated from `contract.ts`.
A stale copy makes the browser check verify thresholds that are no longer
shipped, and it still reports a pass.

Finally, confirm the model runs in a browser, which Python cannot tell you:

```bash
python -m http.server 8899
```

Open `http://127.0.0.1:8899/scripts/verify/browser_check.html` and look for
`BROWSER_CHECK_PASS`. Check two things beyond the pass line: that the logged
abstention band matches the one you just fitted, and that the per-image `P(AI)`
values straddle the band rather than clustering on one side of it.

Then load `dist/` unpacked at `chrome://extensions` and scan a real photograph
and an AI image.

---

## When something breaks

### `Could not find a version that satisfies the requirement torch (from versions: none)`

Not a network problem, despite looking like one. The CUDA index you pointed pip
at has no wheels for your Python version. `cu121` and older stop at Python 3.13;
only `cu126` and `cu128` carry Python 3.14. Use `cu126`:

```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
```

### `CUDA available: False`

The other common problem. The CPU-only PyTorch is installed. Remove it and
reinstall the CUDA build:

```bash
pip uninstall -y torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
```

Then re-run the check in Step 2. If it still says `False`, update the NVIDIA
driver and reboot.

### `CUDA out of memory`

The 1660 Ti has 6 GB, which is not much. Use a smaller batch:

```bash
python scripts/train/finetune_gpu.py --epochs 8 --batch-size 8
```

Still failing? Go smaller and tune less of the model:

```bash
python scripts/train/finetune_gpu.py --epochs 8 --batch-size 4 --unfreeze-last 2
```

Close the browser and any games first, since they hold GPU memory.

### Training is extremely slow (over 20 minutes per epoch)

You are on the CPU. See `CUDA available: False` above.

### `FileNotFoundError: docs/benchmark/matched_corpus_v1/manifest.json`

Step 3 did not finish. Re-run it.

### Final AUROC is about 0.5

The model learned nothing. Check in order:

1. Did Step 3 download both `real/` and `ai/` folders with images in each?
   ```bash
   ls docs/benchmark/matched_corpus_v1/real | wc -l
   ls docs/benchmark/matched_corpus_v1/ai | wc -l
   ```
   Both should be in the thousands.
2. Try a higher head learning rate: add `--lr-head 3e-3`.

### It crashes immediately with a `transformers` error

Version mismatch:

```bash
pip install --upgrade transformers safetensors
```

### The download stops with `HTTP 429`

Rate limiting. Wait ten minutes and re-run; it picks up where it left off.

### `calibrate_onnx.py` exits with "No band met FPR ... within abstain ceiling"

The model cannot reach the false-positive target without abstaining on more than
a quarter of images. That is a real design result, not a crash. Report it rather
than loosening the constraint quietly. If you do loosen it, say so and say by
how much.

---

## If you want to try to do better

Only after a working result is saved. Each of these is one changed flag:

| Try | Command | Why |
|---|---|---|
| Tune more of the model | `--unfreeze-last 8` | More capacity to adapt; may overfit; needs more memory |
| Tune less | `--unfreeze-last 2` | If it is overfitting, or memory is tight |
| Train longer | `--epochs 15` | If val AUROC was still climbing at epoch 8 |
| Bigger backbone | `--backbone facebook/dinov2-base` | Stronger, about 4x slower, use `--batch-size 8` |
| Gentler backbone updates | `--lr-trunk 5e-6` | If loss jumps around instead of falling |

Change **one** thing at a time and record what each gives you. That table of
attempts is itself worth showing, because it demonstrates method rather than
luck.

Whatever you change, Step 7 has to run again. A new model invalidates the old
temperature and the old band.
