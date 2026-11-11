# Product photography pipeline

Not part of the website build. These scripts produced the images in `public/images/products/`
and the hero art (`public/images/sevoura-orbit*.jpg`).

1. `cut.py` — cuts the real bottle out of each ORIGINAL photo in `public/images/<day>.jpg` (rembg, isnet model).
2. `compose.py <cut_dir> <out_dir> [day…]` — places each untouched bottle on a rendered studio set
   designed for that fragrance (wall, plinth, surface, light, botanical shadows, contact shadow).
   The bottle is only scaled down uniformly; its pixels, colours and label are never altered.
3. `hero.py [orbit|ivory|moon]` — renders the bottle-free campaign art.

Thursday: there is no genuine Thursday photograph yet (`public/images/thursday.jpg` shows the Sunday bottle),
so the site shows the Thursday set with typography. To add it: save the photo as `public/images/thursday.jpg`,
run `cut.py`/`compose.py thursday`, and set `thursday` in `src/components/ProductPhoto.tsx`.

Requirements: `pip install "rembg[cpu]" opencv-python pillow numpy`.
