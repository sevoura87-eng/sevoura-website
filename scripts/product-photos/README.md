# Product photography pipeline

Not part of the website build. These scripts produced the images in `public/images/products/`
and the hero art (`public/images/sevoura-orbit*.jpg`).

1. `cut.py` — cuts the real bottle out of each ORIGINAL photo in `public/images/<day>.jpg` (rembg, isnet model).
2. `compose.py <cut_dir> <out_dir> [day…]` — places each untouched bottle on a rendered studio set
   designed for that fragrance (wall, plinth, surface, light, botanical shadows, contact shadow).
   The bottle is only scaled down uniformly; its pixels, colours and label are never altered.
3. `hero.py [orbit|ivory|moon]` — renders the bottle-free campaign art.

Thursday: there is no standalone Thursday photograph (`public/images/thursday.jpg` is a copy of the Sunday photo).
`thu.py` cuts the genuine Thursday bottle out of the gift-box photo (`public/sevoura-bottle.jpeg`) and enlarges it
with plain Lanczos resampling (no AI); `compose.py thursday` places it on its set. Because the source is small,
this bottle is softer than the others — replace it with a dedicated Thursday photograph when one exists.

`hero.py cleanse|elevate|radiate` renders the three plates used by the "A ritual, rooted in meaning" section.

Requirements: `pip install "rembg[cpu]" opencv-python pillow numpy`.
