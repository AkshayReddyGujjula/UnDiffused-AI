"""
A faithful Python port of the shipped extension's inference path.

Ported verbatim (behaviour, not style) from:
  src/content/inference/saliency.ts  -> compute_quality_map
  src/content/inference/crops.ts     -> get_adaptive_crops / generate_grid_crops
  src/content/inference/worker.ts    -> parse_logits_as_shipped / run_extension_path

The point of this module is to reproduce the *bug*, not to fix it. Nothing in
here should be "cleaned up": the wrong array indexing in
`parse_logits_as_shipped` and the `probs[0]` class choice are the artefacts
under measurement.

Known approximation: the browser resizes crops with canvas `drawImage`, whose
downscale filter is not bit-identical to PIL's. We use PIL BILINEAR for both
the corrected and the as-shipped path, so the *difference* between the two
remains attributable to parsing rather than to resampling.
"""
from __future__ import annotations

import numpy as np
from PIL import Image

PATCH_SIZE = 224
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


# --------------------------------------------------------------------------
# preprocessing
# --------------------------------------------------------------------------

def crop_to_tensor(img: Image.Image, x: int, y: int, w: int, h: int) -> np.ndarray:
    """Mirror of extractCropToTensor: crop, force to 224x224, normalise to CHW."""
    patch = img.crop((x, y, x + w, y + h)).resize(
        (PATCH_SIZE, PATCH_SIZE), Image.BILINEAR)
    arr = np.asarray(patch, dtype=np.float32) / 255.0          # HWC, 0..1
    arr = (arr - MEAN) / STD
    return np.transpose(arr, (2, 0, 1))                        # CHW


def whole_image_tensor(img: Image.Image) -> np.ndarray:
    """The corrected single-view baseline: whole image squashed to 224x224."""
    return crop_to_tensor(img, 0, 0, img.width, img.height)


# --------------------------------------------------------------------------
# saliency.ts
# --------------------------------------------------------------------------

def _box_mean(a: np.ndarray, radius: int) -> np.ndarray:
    """computeLocalAverage: mean over the in-bounds part of a (2r+1)^2 window.

    The TS version divides by the number of in-bounds samples rather than by the
    full window area, and accumulates as a JS number (float64) before storing
    into a Float32Array. We add the 25 shifted planes in the same (ky, kx) order
    the TS loops use, so the float64 rounding sequence matches term for term,
    then round to float32 on store as the Float32Array does.
    """
    a = a.astype(np.float64)
    h, w = a.shape
    total = np.zeros((h, w), dtype=np.float64)
    count = np.zeros((h, w), dtype=np.float64)

    for ky in range(-radius, radius + 1):
        for kx in range(-radius, radius + 1):
            y0, y1 = max(0, -ky), min(h, h - ky)
            x0, x1 = max(0, -kx), min(w, w - kx)
            total[y0:y1, x0:x1] += a[y0 + ky:y1 + ky, x0 + kx:x1 + kx]
            count[y0:y1, x0:x1] += 1.0

    return (total / count).astype(np.float32)


def _normalize(a: np.ndarray) -> np.ndarray:
    lo = float(a.min())
    hi = float(a.max())
    rng = hi - lo
    if rng < 1e-4:                      # matches the TS guard exactly
        return np.zeros_like(a, dtype=np.float32)
    return ((a.astype(np.float64) - lo) / rng).astype(np.float32)


def compute_quality_map(img: Image.Image) -> np.ndarray:
    """Port of computeQualityMap: 0.5*laplacian + 0.3*sobel + 0.2*local contrast.

    Every intermediate is stored as float32 because the TS holds each one in a
    Float32Array; arithmetic happens in float64 in between, as JS numbers do.
    """
    rgb = np.asarray(img.convert("RGB"), dtype=np.float64)
    gray = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1]
            + 0.114 * rgb[:, :, 2]).astype(np.float32)
    h, w = gray.shape

    # Clamp-to-edge neighbourhood, matching the TS idx() helper.
    p = np.pad(gray, 1, mode="edge").astype(np.float64)

    lap = np.abs(
        p[0:h, 1:w + 1] + p[1:h + 1, 0:w] + p[1:h + 1, 2:w + 2]
        + p[2:h + 2, 1:w + 1] - 4 * p[1:h + 1, 1:w + 1]
    ).astype(np.float32)
    laplacian_var = _box_mean(lap, 2)

    gx = (-p[0:h, 0:w] + p[0:h, 2:w + 2]
          - 2 * p[1:h + 1, 0:w] + 2 * p[1:h + 1, 2:w + 2]
          - p[2:h + 2, 0:w] + p[2:h + 2, 2:w + 2])
    gy = (-p[0:h, 0:w] - 2 * p[0:h, 1:w + 1] - p[0:h, 2:w + 2]
          + p[2:h + 2, 0:w] + 2 * p[2:h + 2, 1:w + 1] + p[2:h + 2, 2:w + 2])
    edges = np.sqrt(gx * gx + gy * gy).astype(np.float32)

    mean_gray = _box_mean(gray, 2)
    gray_sq = (gray.astype(np.float64) * gray.astype(np.float64)).astype(np.float32)
    mean_gray_sq = _box_mean(gray_sq, 2)

    mg = mean_gray.astype(np.float64)
    variance = np.maximum(0.0, mean_gray_sq.astype(np.float64) - mg * mg)
    contrast = np.sqrt(variance).astype(np.float32)

    return (0.5 * _normalize(laplacian_var).astype(np.float64)
            + 0.3 * _normalize(edges).astype(np.float64)
            + 0.2 * _normalize(contrast).astype(np.float64)).astype(np.float32)


# --------------------------------------------------------------------------
# crops.ts
# --------------------------------------------------------------------------

def generate_grid_crops(width: int, height: int) -> list[dict]:
    size = PATCH_SIZE
    if width <= size and height <= size:
        return [{"x": 0, "y": 0, "width": width, "height": height, "label": "Global"}]

    x_left, x_center, x_right = 0, max(0, (width - size) // 2), max(0, width - size)
    y_top, y_center, y_bottom = 0, max(0, (height - size) // 2), max(0, height - size)

    labels = ["Top-Left", "Top-Center", "Top-Right",
              "Mid-Left", "Center", "Mid-Right",
              "Bottom-Left", "Bottom-Center", "Bottom-Right"]
    coords = [(x, y) for y in (y_top, y_center, y_bottom)
              for x in (x_left, x_center, x_right)]
    return [{"x": x, "y": y, "width": size, "height": size, "label": lab}
            for (x, y), lab in zip(coords, labels)]


def get_adaptive_crops(width: int, height: int, quality_map: np.ndarray,
                       num_crops: int = 9) -> list[dict]:
    """Port of getAdaptiveCrops: stride-56 sliding window, 30%-overlap NMS."""
    size = PATCH_SIZE
    if width <= size and height <= size:
        return [{"x": 0, "y": 0, "width": width, "height": height, "label": "Global"}]

    stride, sample_step = 56, 8
    offs = np.arange(0, size, sample_step)          # 0,8,...,216 -> 28 samples

    candidates = []
    for y in range(0, height - size + 1, stride):
        for x in range(0, width - size + 1, stride):
            window = quality_map[np.ix_(y + offs, x + offs)]
            candidates.append((x, y, float(window.mean())))

    # Stable descending sort, matching V8's stable Array.prototype.sort.
    candidates.sort(key=lambda c: -c[2])

    selected: list[tuple[int, int, float]] = []
    area = size * size
    for cx, cy, score in candidates:
        if len(selected) >= num_crops:
            break
        overlapping = False
        for sx, sy, _ in selected:
            ix, iy = max(cx, sx), max(cy, sy)
            ax, ay = min(cx + size, sx + size), min(cy + size, sy + size)
            if ix < ax and iy < ay and ((ax - ix) * (ay - iy)) / area > 0.3:
                overlapping = True
                break
        if not overlapping:
            selected.append((cx, cy, score))

    crops = [{"x": x, "y": y, "width": size, "height": size,
              "label": "Adaptive-{} ({:.2f})".format(i + 1, s)}
             for i, (x, y, s) in enumerate(selected)]

    if len(crops) < num_crops:                      # fallback fill, as in TS
        for fc in generate_grid_crops(width, height):
            if len(crops) >= num_crops:
                break
            dup = any(abs(c["x"] - fc["x"]) < 10 and abs(c["y"] - fc["y"]) < 10
                      for c in crops)
            if not dup:
                crops.append({**fc, "label": "Fallback-" + fc["label"]})
    return crops


# --------------------------------------------------------------------------
# worker.ts -- output parsing
# --------------------------------------------------------------------------

def softmax(logits: np.ndarray) -> np.ndarray:
    e = np.exp(logits - logits.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + np.exp(-x))


def parse_logits_as_shipped(logits: np.ndarray) -> list[float]:
    """Reproduces runInference() in worker.ts, bug included.

    logits: [batch, classes]. The shipped code flattens the tensor and, when
    classes != 2, reads position `i` for batch item `i` -- so with 3 classes it
    reads flat positions 0,1,2,3 for a batch of 4, mixing class and batch axes.
    It then treats a raw logit as a probability when it happens to fall in
    [0,1], and sigmoids it otherwise.
    """
    batch, classes = logits.shape
    flat = logits.reshape(-1)

    out: list[float] = []
    for i in range(batch):
        if classes == 2:
            probs = softmax(logits[i])
            out.append(float(probs[0]))          # the unresolved coin-flip
        else:
            raw = float(flat[i])                 # <-- the indexing bug
            out.append(raw if 0.0 <= raw <= 1.0 else float(_sigmoid(raw)))
    return out


def quadrant_crops(width: int, height: int) -> list[dict]:
    """The 4 'global' crops built in worker.ts before the global model runs."""
    hw, hh = width // 2, height // 2
    return [
        {"x": 0, "y": 0, "width": hw, "height": hh, "label": "Global_TL"},
        {"x": hw, "y": 0, "width": hw, "height": hh, "label": "Global_TR"},
        {"x": 0, "y": hh, "width": hw, "height": hh, "label": "Global_BL"},
        {"x": hw, "y": hh, "width": hw, "height": hh, "label": "Global_BR"},
    ]


def fuse_as_shipped(global_scores: list[float], local_scores: list[float] | None):
    """Stages 1-3 of worker.ts: average quadrants, early-exit gate, 25/75 blend.

    Returns (final_ai_prob, global_ai_prob, local_ai_prob_or_None, took_local).
    """
    global_ai = float(np.mean(global_scores))
    is_uncertain = 0.05 < global_ai < 0.95

    if not is_uncertain or not local_scores:
        return global_ai, global_ai, None, False

    ranked = sorted(local_scores, reverse=True)
    if len(ranked) >= 3:
        local_ai = float(np.mean(ranked[:3]))
    else:
        local_ai = float(ranked[0])

    return 0.25 * global_ai + 0.75 * local_ai, global_ai, local_ai, True
