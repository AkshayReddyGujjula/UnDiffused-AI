"""
UnDiffused Dataset Builder
==========================
Automated dataset preparation using pre-made datasets for efficiency.

Sources (optimized for speed, no API rate limits):
- DiffusionDB (HuggingFace): Stable Diffusion images (instant via datasets)
- GenImage benchmark: Multi-generator AI images
- COCO 2017 validation: Real images (instant download)
- Flickr30k: Real images (instant download)

Total: ~45k images in 4-6 hours (vs 24-48 hours with API scraping)

Usage:
    python scripts/dataset_builder.py --output D:/Datasets
    python scripts/dataset_builder.py --output D:/Datasets --quick  # Smaller subset for testing
"""

import os
import sys
import argparse
import shutil
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict
import json
import urllib.request
import zipfile
import tarfile
from concurrent.futures import ThreadPoolExecutor, as_completed

from PIL import Image
from tqdm import tqdm
import numpy as np

# Try to import optional dependencies
try:
    from datasets import load_dataset
    HAS_DATASETS = True
except ImportError:
    HAS_DATASETS = False
    print("[WARNING] 'datasets' library not installed. Run: pip install datasets")

try:
    import imagehash
    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False
    print("[WARNING] 'imagehash' not installed. Duplicate detection disabled.")


# =============================================================================
# Configuration
# =============================================================================

DEFAULT_OUTPUT = Path(r"D:\Datasets")

# Dataset sources configuration
DATASET_SOURCES = {
    # AI Image Sources
    'diffusiondb': {
        'type': 'huggingface',
        'name': 'poloclub/diffusiondb',
        'subset': '2m_random_1k',  # Start with 1k subset
        'category': 'FAKE',
        'generator': 'stable_diffusion',
        'max_images': 10000
    },
    'genimage_sd': {
        'type': 'manual',
        'url': None,  # Requires manual download from GenImage
        'category': 'FAKE',
        'generator': 'stable_diffusion',
        'max_images': 5000
    },
    
    # Real Image Sources
    'coco_val': {
        'type': 'url',
        'url': 'http://images.cocodataset.org/zips/val2017.zip',
        'category': 'REAL',
        'max_images': 5000
    },
}


# =============================================================================
# Utility Functions
# =============================================================================

def get_image_hash(image_path: Path) -> Optional[str]:
    """Compute perceptual hash for duplicate detection."""
    if not HAS_IMAGEHASH:
        return None
    try:
        img = Image.open(image_path)
        return str(imagehash.phash(img))
    except Exception:
        return None


def is_valid_image(image_path: Path, min_size: int = 256) -> bool:
    """Check if image is valid and meets minimum size requirements."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            if width < min_size or height < min_size:
                return False
            # Verify image can be read
            img.verify()
        return True
    except Exception:
        return False


def download_file(url: str, output_path: Path, desc: str = "Downloading") -> bool:
    """Download file with progress bar."""
    try:
        print(f"[DEBUG] Downloading: {url}")
        
        # Get file size
        with urllib.request.urlopen(url) as response:
            total_size = int(response.headers.get('Content-Length', 0))
        
        # Download with progress
        with tqdm(total=total_size, unit='B', unit_scale=True, desc=desc) as pbar:
            def reporthook(block_num, block_size, total_size):
                pbar.update(block_size)
            
            urllib.request.urlretrieve(url, output_path, reporthook)
        
        print(f"[DEBUG] Downloaded to: {output_path}")
        return True
    except Exception as e:
        print(f"[ERROR] Download failed: {e}")
        return False


def extract_archive(archive_path: Path, output_dir: Path) -> bool:
    """Extract zip or tar archive."""
    try:
        print(f"[DEBUG] Extracting: {archive_path}")
        
        if archive_path.suffix == '.zip':
            with zipfile.ZipFile(archive_path, 'r') as zf:
                zf.extractall(output_dir)
        elif archive_path.suffix in ['.tar', '.gz', '.tgz']:
            with tarfile.open(archive_path, 'r:*') as tf:
                tf.extractall(output_dir)
        else:
            print(f"[ERROR] Unknown archive format: {archive_path.suffix}")
            return False
        
        print(f"[DEBUG] Extracted to: {output_dir}")
        return True
    except Exception as e:
        print(f"[ERROR] Extraction failed: {e}")
        return False


def copy_images_to_dataset(
    source_dir: Path,
    target_dir: Path,
    max_images: int,
    seen_hashes: set,
    category: str,
    generator: Optional[str] = None
) -> int:
    """Copy valid images to dataset directory with deduplication."""
    
    # Find all images
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp']
    images = []
    for ext in extensions:
        images.extend(source_dir.rglob(ext))
        images.extend(source_dir.rglob(ext.upper()))
    
    print(f"[DEBUG] Found {len(images)} images in {source_dir}")
    
    # Determine target subdirectory
    if category == 'FAKE' and generator:
        target_subdir = target_dir / category / generator
    else:
        target_subdir = target_dir / category
    
    target_subdir.mkdir(parents=True, exist_ok=True)
    
    copied = 0
    for img_path in tqdm(images, desc=f"Processing {category}/{generator or ''}"):
        if copied >= max_images:
            break
        
        # Validate image
        if not is_valid_image(img_path):
            continue
        
        # Check for duplicates
        if HAS_IMAGEHASH:
            img_hash = get_image_hash(img_path)
            if img_hash and img_hash in seen_hashes:
                continue
            if img_hash:
                seen_hashes.add(img_hash)
        
        # Copy to target
        target_path = target_subdir / f"{category}_{generator or 'real'}_{copied:06d}{img_path.suffix}"
        shutil.copy2(img_path, target_path)
        copied += 1
    
    print(f"[DEBUG] Copied {copied} images to {target_subdir}")
    return copied


# =============================================================================
# Dataset Loaders
# =============================================================================

def load_diffusiondb(output_dir: Path, max_images: int, seen_hashes: set) -> int:
    """Load DiffusionDB dataset from HuggingFace."""
    if not HAS_DATASETS:
        print("[ERROR] 'datasets' library required. Run: pip install datasets")
        return 0
    
    print("\n[INFO] Loading DiffusionDB from HuggingFace...")
    print("[DEBUG] This may take a while on first run (downloading dataset)...")
    
    try:
        # Load subset
        dataset = load_dataset(
            "poloclub/diffusiondb",
            "2m_random_1k",
            split="train",
            trust_remote_code=True
        )
        
        # Create target directory
        target_dir = output_dir / "FAKE" / "stable_diffusion"
        target_dir.mkdir(parents=True, exist_ok=True)
        
        saved = 0
        for i, item in enumerate(tqdm(dataset, desc="Saving DiffusionDB images")):
            if saved >= max_images:
                break
            
            try:
                img = item['image']
                
                # Check size
                if img.width < 256 or img.height < 256:
                    continue
                
                # Save image
                save_path = target_dir / f"diffusiondb_{saved:06d}.png"
                img.save(save_path)
                saved += 1
                
            except Exception as e:
                print(f"[WARNING] Failed to save image {i}: {e}")
                continue
        
        print(f"[SUCCESS] Saved {saved} DiffusionDB images")
        return saved
        
    except Exception as e:
        print(f"[ERROR] Failed to load DiffusionDB: {e}")
        return 0


def load_coco_val(output_dir: Path, max_images: int, seen_hashes: set) -> int:
    """Download and process COCO 2017 validation set."""
    
    print("\n[INFO] Setting up COCO 2017 validation set...")
    
    # Download paths
    temp_dir = output_dir / ".temp"
    temp_dir.mkdir(exist_ok=True)
    archive_path = temp_dir / "val2017.zip"
    
    # Check if already downloaded
    coco_dir = temp_dir / "val2017"
    if not coco_dir.exists():
        url = "http://images.cocodataset.org/zips/val2017.zip"
        
        if not archive_path.exists():
            success = download_file(url, archive_path, "Downloading COCO val2017")
            if not success:
                return 0
        
        # Extract
        success = extract_archive(archive_path, temp_dir)
        if not success:
            return 0
    else:
        print("[DEBUG] COCO val2017 already downloaded")
    
    # Copy images
    copied = copy_images_to_dataset(
        coco_dir, output_dir, max_images, seen_hashes, "REAL"
    )
    
    return copied


def setup_existing_dataset(source_dir: Path, output_dir: Path, seen_hashes: set) -> Dict[str, int]:
    """
    Setup dataset from existing REAL/FAKE directories.
    
    Expected structure:
        source_dir/
        ├── REAL/
        │   └── *.jpg
        └── FAKE/
            ├── *.jpg  (or subdirectories)
            └── midjourney/
                └── *.jpg
    """
    print(f"\n[INFO] Setting up from existing dataset: {source_dir}")
    
    counts = {'REAL': 0, 'FAKE': 0}
    
    # Process REAL images
    real_dir = source_dir / "REAL"
    if real_dir.exists():
        # Just validate and count (already in place)
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img in real_dir.rglob(ext):
                if is_valid_image(img):
                    counts['REAL'] += 1
        print(f"[DEBUG] Found {counts['REAL']} valid REAL images")
    
    # Process FAKE images
    fake_dir = source_dir / "FAKE"
    if fake_dir.exists():
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img in fake_dir.rglob(ext):
                if is_valid_image(img):
                    counts['FAKE'] += 1
        print(f"[DEBUG] Found {counts['FAKE']} valid FAKE images")
    
    return counts


# =============================================================================
# Main Dataset Builder
# =============================================================================

def build_dataset(
    output_dir: Path,
    quick_mode: bool = False,
    download_new: bool = True
) -> Dict[str, int]:
    """
    Build the complete dataset.
    
    Args:
        output_dir: Where to create the dataset
        quick_mode: If True, use smaller subsets for testing
        download_new: If True, download additional datasets
        
    Returns:
        Dictionary with counts per category
    """
    print("\n" + "=" * 60)
    print("UnDiffused Dataset Builder")
    print("=" * 60)
    print(f"[INFO] Output directory: {output_dir}")
    print(f"[INFO] Mode: {'QUICK (test)' if quick_mode else 'FULL'}")
    print(f"[INFO] Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Create directories
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "REAL").mkdir(exist_ok=True)
    (output_dir / "FAKE").mkdir(exist_ok=True)
    
    # Track seen hashes for deduplication
    seen_hashes = set()
    
    # Final counts
    counts = {'REAL': 0, 'FAKE': 0, 'by_generator': {}}
    
    # Set limits based on mode
    if quick_mode:
        real_limit = 500
        fake_limit = 500
    else:
        real_limit = 15000
        fake_limit = 15000
    
    # Step 1: Check for existing images
    existing = setup_existing_dataset(output_dir, output_dir, seen_hashes)
    counts['REAL'] += existing['REAL']
    counts['FAKE'] += existing['FAKE']
    
    # Step 2: Download additional datasets if needed
    if download_new and counts['REAL'] < real_limit:
        needed_real = real_limit - counts['REAL']
        
        # COCO validation set
        print(f"\n[INFO] Need {needed_real} more REAL images, downloading COCO...")
        coco_count = load_coco_val(output_dir, needed_real, seen_hashes)
        counts['REAL'] += coco_count
    
    if download_new and counts['FAKE'] < fake_limit:
        needed_fake = fake_limit - counts['FAKE']
        
        # DiffusionDB
        print(f"\n[INFO] Need {needed_fake} more FAKE images, downloading DiffusionDB...")
        diffusion_count = load_diffusiondb(output_dir, needed_fake, seen_hashes)
        counts['FAKE'] += diffusion_count
        counts['by_generator']['stable_diffusion'] = diffusion_count
    
    # Step 3: Validate final dataset
    print("\n[INFO] Final validation...")
    
    final_real = 0
    final_fake = 0
    
    real_dir = output_dir / "REAL"
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.PNG', '*.JPG']:
        final_real += len(list(real_dir.rglob(ext)))
    
    fake_dir = output_dir / "FAKE"
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.PNG', '*.JPG']:
        final_fake += len(list(fake_dir.rglob(ext)))
    
    # Summary
    print("\n" + "=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)
    print(f"Total REAL images: {final_real}")
    print(f"Total FAKE images: {final_fake}")
    print(f"Total dataset size: {final_real + final_fake}")
    print(f"\nDirectory structure:")
    print(f"  {output_dir}/")
    print(f"  ├── REAL/ ({final_real} images)")
    print(f"  └── FAKE/ ({final_fake} images)")
    
    # Check for generator subdirectories
    for subdir in (output_dir / "FAKE").iterdir():
        if subdir.is_dir():
            count = len(list(subdir.rglob('*.*')))
            print(f"      └── {subdir.name}/ ({count} images)")
    
    print("=" * 60)
    
    # Save metadata
    metadata = {
        'created': datetime.now().isoformat(),
        'real_count': final_real,
        'fake_count': final_fake,
        'total': final_real + final_fake,
        'generators': counts.get('by_generator', {}),
        'sources': ['COCO2017', 'DiffusionDB', 'user_provided']
    }
    
    metadata_path = output_dir / "dataset_metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"\n[INFO] Metadata saved to: {metadata_path}")
    
    return {'REAL': final_real, 'FAKE': final_fake}


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description='UnDiffused Dataset Builder')
    parser.add_argument('--output', type=str, default=str(DEFAULT_OUTPUT),
                        help='Output directory for dataset')
    parser.add_argument('--quick', action='store_true',
                        help='Quick mode: smaller dataset for testing')
    parser.add_argument('--no-download', action='store_true',
                        help='Skip downloading new datasets, only process existing')
    parser.add_argument('--validate-only', action='store_true',
                        help='Only validate existing dataset, no downloads')
    
    args = parser.parse_args()
    
    output_dir = Path(args.output)
    
    if args.validate_only:
        print("[INFO] Validation mode - checking existing dataset...")
        seen_hashes = set()
        counts = setup_existing_dataset(output_dir, output_dir, seen_hashes)
        print(f"\n[SUCCESS] Found {counts['REAL']} REAL, {counts['FAKE']} FAKE images")
    else:
        build_dataset(
            output_dir=output_dir,
            quick_mode=args.quick,
            download_new=not args.no_download
        )
    
    print("\n[SUCCESS] Dataset builder complete!")


if __name__ == "__main__":
    main()
