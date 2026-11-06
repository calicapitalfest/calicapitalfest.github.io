#!/usr/bin/env python3
"""One-off image optimiser for static/assets.

- Converts the PNGs the site actually uses to WebP, resized to roughly 2x the
  size they are displayed at (retina), and removes the PNG from static/.
- Moves assets nothing references (and Photoshop .xmp sidecars) out of static/
  so they stop being published.
- Originals go to temp/original-assets/ (git-ignored) so nothing is lost.

Needs ImageMagick (`magick`) built with WebP. Run from the project root:
    python3 scripts/optimize-images.py
"""
import fnmatch
import os
import shutil
import subprocess

STATIC = "static"
BACKUP = "temp/original-assets"

# glob (relative to static/) -> max width in px (never upscaled)
CONVERT = [
    ("assets/brand/logo.png", 1240),  # hero logo, shown <= 620px
    ("assets/brand/sun-face.png", 200),  # nav 42px, footer 64px
    ("assets/brand/deco-star.png", 400),  # hero deco <= 200px
    ("assets/brand/deco-asterisk.png", 400),
    ("assets/brand/deco-splat.png", 400),
    ("assets/brand/trimmed/*.png", 400),  # section icons (already 400px)
    ("assets/lineup/*.png", 640),  # hero stickers, ~320px tall at 1x
    ("assets/2025/judge-*.png", 720),
    ("assets/2025/floor-curved.png", 1800),
    ("assets/2025/banner-2025.png", 509),
    ("assets/2025/sponsors/*.png", 600),
]

# referenced by name in the source; leave untouched
KEEP = {
    "assets/favicon.svg",
    "favicon.svg",
    "favicon-2026.ico",
    "favicon-2026.png",
    "apple-touch-icon-2026.png",
    "robots.txt",
    ".nojekyll",
}
KEEP_GLOBS = ["fonts/*", "assets/brand/flat-*.svg"]
# flat-*.svg that the cards use are kept by the glob above; these four aren't referenced
UNUSED_SVG = {"assets/brand/flat-arch.svg", "assets/brand/flat-blob-purple.svg",
              "assets/brand/flat-blob.svg", "assets/brand/flat-corner.svg"}


def backup(rel):
    dst = os.path.join(BACKUP, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.move(os.path.join(STATIC, rel), dst)


def main():
    files = []
    for root, _, names in os.walk(STATIC):
        for n in names:
            files.append(os.path.relpath(os.path.join(root, n), STATIC))

    converted = set()
    for rel in sorted(files):
        for pattern, width in CONVERT:
            if fnmatch.fnmatch(rel, pattern):
                src = os.path.join(STATIC, rel)
                out = os.path.splitext(src)[0] + ".webp"
                subprocess.run(
                    ["magick", src, "-resize", f"{width}x>", "-strip",
                     "-define", "webp:method=6", "-define", "webp:alpha-quality=95",
                     "-quality", "84", out],
                    check=True,
                )
                converted.add(rel)
                print(f"{rel}: {os.path.getsize(src)//1024}K -> {os.path.getsize(out)//1024}K")
                break

    for rel in converted:
        backup(rel)

    for rel in sorted(files):
        if rel in converted or rel in KEEP:
            continue
        if any(fnmatch.fnmatch(rel, g) for g in KEEP_GLOBS) and rel not in UNUSED_SVG:
            continue
        print("unused ->", rel)
        backup(rel)


if __name__ == "__main__":
    main()
