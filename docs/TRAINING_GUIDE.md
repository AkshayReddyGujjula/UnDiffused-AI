# Training guide

Written assuming you have never trained a model before. Every command is meant
to be copied and pasted exactly. If something goes wrong, jump to
[When something breaks](#when-something-breaks) — the common failures are all
listed with their fixes.

**Time:** about 1–2 hours, most of it waiting.
**You need:** the desktop with the GTX 1660 Ti.

---

## Step 0 — Get the code onto the desktop

I only committed locally, as you asked, so the work is sitting on the **laptop**
and has not left it. Push it from the laptop first.

**On the laptop**, open a terminal in the project folder and run:

```bash
git push -u origin stage1-baseline
```

**On the desktop**, open a terminal in the project folder and run:

```bash
git fetch origin && git checkout stage1-baseline && git pull
```

Confirm you have the right code — this should print the training script:

```bash
ls scripts/train/
```

You should see `finetune_gpu.py` and `export_onnx.py`. If you don't, the pull
didn't work; re-run Step 0.

---

## Step 1 — Check the GPU is visible

A GPU that Windows can see is not automatically a GPU that PyTorch can use.
Check it before doing anything else:

```bash
nvidia-smi
```

You should see a table with `NVIDIA GeForce GTX 1660 Ti` and a memory figure
around 6144MiB. If the command isn't found, your NVIDIA driver isn't installed —
install it from nvidia.com, reboot, and try again.

---

## Step 2 — Install the Python packages

This is the step most likely to go wrong, because **the default PyTorch install
is CPU-only.** Installing it the ordinary way will appear to work and then train
about thirty times slower with no error message. Use this exact command:

```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

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

**If it says `False`, stop.** Do not continue — training will run on the CPU and
take all day. Go to [When something breaks](#when-something-breaks).

---

## Step 3 — Get the training images

The image files are not in git (they'd bloat the repo), so the desktop needs to
download them. This script re-fetches them from the internet:

```bash
python scripts/bench/fetch_matched_control.py --pairs 4000 --start-offset 200000 --out docs/benchmark/matched_corpus_v1
```

**This takes roughly 45 minutes.** It prints a running count like
`68/4000 pairs`. Leave it alone and let it finish.

> If the laptop already finished downloading these, you can copy the folder
> `docs/benchmark/matched_corpus_v1` across on a USB stick instead and skip this
> step. That's faster than re-downloading.

Check it worked:

```bash
python -c "import json; m=json.load(open('docs/benchmark/matched_corpus_v1/manifest.json')); print(m['pairs'], 'pairs')"
```

Anything above about 3000 pairs is fine.

### What these images are, and why it matters

Each pair is one real photograph from the web and one AI image generated from
that photograph's own caption. **Same subject, one real, one generated.**

This matters more than it sounds. My first attempt trained on ordinary photos
versus AI images from a different source, and scored 0.99 — which looked
excellent and was almost entirely fake. The model had learned "these two piles
of images come from different websites," not "this one is generated." Matching
the content removes that shortcut. The scores you'll see are lower than 0.99,
and they're the real ones.

---

## Step 4 — Train

**First, a 2-minute smoke test.** This runs every stage of the pipeline on a
tiny subset so any crash happens now rather than 40 minutes into a real run:

```bash
python scripts/train/finetune_gpu.py --limit-pairs 24 --epochs 2 --batch-size 8 --out models/_smoketest
```

It should print two epochs and `Checkpoint: models\_smoketest\detector_best.pt`.
If it does, delete that folder and continue. If it errors, stop and send me the
message — do not start the real run.

Then the real thing:

```bash
python scripts/train/finetune_gpu.py --epochs 8 --batch-size 16
```

**Roughly 30–60 minutes on the 1660 Ti.**

You'll see one line per epoch:

```
epoch  1  loss 0.6012  val AUROC 0.7431  acc 0.681  (214s)
epoch  2  loss 0.5233  val AUROC 0.7902  acc 0.715  (211s)
```

### How to read this

- **AUROC** is the number that matters. It's the chance the model rates a random
  AI image as more suspicious than a random real one. **0.5 means useless**
  (coin flip); 1.0 means perfect. The old shipped model scored 0.50 — literally
  nothing.
- **loss** should generally fall. Small bounces are normal.
- **val AUROC** should rise, then flatten. When it flattens, it's done learning.

**What counts as success:** anything meaningfully above **0.82**, which is what a
simple probe already achieved without fine-tuning. Around 0.85–0.90 would be a
good result. If it lands near 0.5, something is wrong — see the troubleshooting
section.

**If `val AUROC` rises and then starts falling**, that's overfitting — the model
is memorising. Not a problem: the script only ever saves the best epoch, so the
saved file is from before it went wrong.

At the end it prints the final scores:

```
val            AUROC 0.8xxx  acc 0.7xxx
test           AUROC 0.8xxx  acc 0.7xxx
test_heldout   AUROC 0.8xxx  acc 0.7xxx
```

`test_heldout` is the important one. It's SDXL, a generator the model **never
saw during training**. It tells you whether the model learned something general
or just memorised the three generators it was shown. Expect it to be a bit lower
than `test` — that's normal and honest.

---

## Step 5 — Convert the model for the browser extension

```bash
python scripts/train/export_onnx.py --checkpoint models/v2/detector_best.pt --quantize
```

This converts the model to ONNX (the format the extension runs), makes a
compressed int8 version, and **checks the conversion didn't change the model's
answers**. It prints:

```
max |torch - onnx| over 8 samples: 1.2e-06
export verified
```

That number must be small. If it prints `EXPORT VERIFICATION FAILED`, stop and
tell me — do not ship that file.

You may also see:

```
QUANT_WARN: int8 diverges from fp32 by 0.486 on probe tensors.
```

**This is not a failure, but do not ignore it.** Compressing to int8 changes the
model's answers slightly, and that warning says the change is not tiny. It is
measured on random tensors, which exaggerates it — the shipped probe warned too
and still scored 0.894. The point is that you have to *check* rather than
assume, which is Step 6.

The export also now refuses to write a file containing `ConvInteger`, an
operation that works in Python and does not exist in the browser's runtime. That
bug shipped once already.

It writes into `public/models/`:
- `detector_v2.onnx` — full size
- `detector_v2_int8.onnx` — compressed, roughly 4× smaller
- `detector_v2_meta.json` — the model's specification, **read from the actual
  file rather than typed by hand.** The old project got this wrong and it's how
  the original bug survived.

---

## Step 6 — Score it properly

```bash
python scripts/bench/score_model.py --model public/models/detector_v2.onnx --meta public/models/detector_v2_meta.json
```

This runs the model against the benchmark, including the laundering tests (what
happens when an image is re-compressed, resized, or screenshotted) and writes
`docs/benchmark/v2_results.json`.

**This is the number that goes in your CV, not the training-screen number.**

Compare the int8 result against the current shipped model: **0.894 AUROC** on
`matched_control_v1`. If your fine-tuned int8 model scores lower, keep the
existing one — a fine-tune that loses to a frozen linear probe is a legitimate
result to report, not a failure to hide.

Then confirm it actually runs in a browser, which Python cannot tell you:

```bash
python -m http.server 8899
```

Open `http://127.0.0.1:8899/scripts/verify/browser_check.html` and look for
`BROWSER_CHECK_PASS`.

---

## Step 7 — Commit

```bash
git add -A
git commit -m "Train and export v2 detector"
git push
```

---

## When something breaks

### `CUDA available: False`

The most common problem, and the most important to fix. You have the CPU-only
PyTorch installed. Remove it and reinstall the CUDA build:

```bash
pip uninstall -y torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

Then re-run the check in Step 2. If it still says `False`, update your NVIDIA
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

Close Chrome and any games first — they hold GPU memory.

### Training is extremely slow (over 20 minutes per epoch)

You're on the CPU. See `CUDA available: False` above.

### `FileNotFoundError: docs/benchmark/matched_corpus_v1/manifest.json`

Step 3 didn't finish. Re-run it.

### Final AUROC is about 0.5

The model learned nothing. Check in order:
1. Did Step 3 download both `real/` and `ai/` folders with images in each?
   ```bash
   ls docs/benchmark/matched_corpus_v1/real | wc -l
   ls docs/benchmark/matched_corpus_v1/ai | wc -l
   ```
   Both should be in the thousands.
2. Try a higher head learning rate: add `--lr-head 3e-3`.
3. Tell me the numbers and I'll look.

### It crashes immediately with a `transformers` error

Version mismatch:

```bash
pip install --upgrade transformers safetensors
```

### The download stops with `HTTP 429`

You're being rate-limited. Wait ten minutes and re-run; it picks up where it
left off.

---

## If you want to try to do better

Only after you have a working result saved. Each of these is one changed flag:

| Try | Command | Why |
|---|---|---|
| Tune more of the model | `--unfreeze-last 8` | More capacity to adapt; may overfit; needs more memory |
| Tune less | `--unfreeze-last 2` | If it's overfitting, or memory is tight |
| Train longer | `--epochs 15` | If val AUROC was still climbing at epoch 8 |
| Bigger backbone | `--backbone facebook/dinov2-base` | Stronger, ~4× slower, use `--batch-size 8` |
| Gentler backbone updates | `--lr-trunk 5e-6` | If loss jumps around instead of falling |

Change **one** thing at a time and write down what each gives you. That table of
attempts is itself worth showing an interviewer — it demonstrates method rather
than luck.

---

## What to say about this project

The honest version is the strong version:

> The extension shipped a model that scored **0.50 AUROC — statistically
> indistinguishable from guessing.** I measured it against 100 labelled images
> and found it caught 0 of 50 AI images. The output-parsing code was also
> reading the wrong array positions, but fixing that changed nothing, because
> there was no signal underneath to recover.
>
> I rebuilt it on a frozen DINOv2 backbone. My first version scored 0.99 — and I
> didn't trust it, because it held flat under JPEG compression when generation
> artifacts should degrade. I built a content-matched control set and it dropped
> to 0.66. The model had learned to tell two *datasets* apart, not real from
> generated. A held-out-generator test had certified it at 0.99 and missed this
> entirely.
>
> Retrained on content-matched pairs, it scores **[your number]**, and that one
> is real.

The 0.99 you didn't ship is a better story than a 0.99 you did.
