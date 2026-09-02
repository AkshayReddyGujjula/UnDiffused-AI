"""
Stage 2: laundering transforms applied at evaluation time.

Images in the wild are not pristine. They are re-encoded by messaging apps,
resized by content management systems, screenshotted, and pushed through
several JPEG generations before anyone right-clicks one. The literature is
blunt about the consequence: real-world transformation destroys the
high-frequency signal most detectors depend on, and the NTIRE 2026 challenge was
built specifically around that failure.

A detector evaluated only on pristine images reports a number that will not
survive contact with a browser. So every headline figure in this project is
reported alongside its laundered counterparts.

These transforms serve a second purpose. The authentic half of the corpus is web
JPEG and the generated half is clean renders, so a classifier could separate
them on encoder history alone and never look at image content. `normalize_512_q90`
forces both halves through identical resolution and identical JPEG history. If
a score survives that, it is not riding the confound.
"""
from __future__ import annotations

import io

from PIL import Image


def _jpeg_roundtrip(img: Image.Image, quality: int) -> Image.Image:
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="JPEG", quality=quality)
    buf.seek(0)
    return Image.open(buf).convert("RGB")


def identity(img: Image.Image) -> Image.Image:
    return img.convert("RGB")


def normalize_512_q90(img: Image.Image) -> Image.Image:
    """Confound control: identical resolution and identical JPEG history."""
    return _jpeg_roundtrip(img.convert("RGB").resize((512, 512), Image.BICUBIC), 90)


def _quality(q: int):
    def fn(img: Image.Image) -> Image.Image:
        return _jpeg_roundtrip(img, q)
    fn.__name__ = "jpeg_q{}".format(q)
    return fn


def resize_chain(img: Image.Image) -> Image.Image:
    """A CMS thumbnailing then a client upscaling it back, as commonly happens."""
    img = img.convert("RGB")
    w, h = img.size
    small = img.resize((max(1, w // 2), max(1, h // 2)), Image.BILINEAR)
    back = small.resize((w, h), Image.BICUBIC)
    return _jpeg_roundtrip(back, 85)


def screenshot(img: Image.Image) -> Image.Image:
    """Screenshot re-capture: rescale to a display-ish size, then re-encode.

    This is the case that defeats provenance entirely -- SynthID and C2PA
    survive neither -- so it is the case the model layer most needs to handle.
    """
    img = img.convert("RGB")
    w, h = img.size
    scale = 900 / max(w, h)
    if scale < 1.0:
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))),
                         Image.LANCZOS)
    return _jpeg_roundtrip(img, 80)


def webp_q75(img: Image.Image) -> Image.Image:
    """Messaging apps and modern CDNs re-encode to WebP."""
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="WEBP", quality=75)
    buf.seek(0)
    return Image.open(buf).convert("RGB")


def double_jpeg(img: Image.Image) -> Image.Image:
    """Two generations of JPEG, as an image picks up on its way around."""
    return _jpeg_roundtrip(_jpeg_roundtrip(img, 85), 70)


TRANSFORMS = {
    "identity": identity,
    "normalize_512_q90": normalize_512_q90,
    "jpeg_q75": _quality(75),
    "jpeg_q50": _quality(50),
    "jpeg_q30": _quality(30),
    "double_jpeg": double_jpeg,
    "resize_chain": resize_chain,
    "webp_q75": webp_q75,
    "screenshot": screenshot,
}

#: Applied to every headline figure. `identity` is the pristine reference and
#: `normalize_512_q90` is the confound control; the rest are the laundering
#: ladder, ordered roughly by how much signal they are expected to remove.
DEFAULT_SUITE = [
    "identity",
    "normalize_512_q90",
    "jpeg_q75",
    "jpeg_q50",
    "jpeg_q30",
    "double_jpeg",
    "resize_chain",
    "webp_q75",
    "screenshot",
]
