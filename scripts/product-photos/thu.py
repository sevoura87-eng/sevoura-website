from PIL import Image, ImageFilter
import numpy as np, cv2
from rembg import remove, new_session
im = Image.open('/home/claude/src/sevoura-website-main/public/sevoura-bottle.jpeg').convert('RGB')
c = im.crop((222, 212, 332, 378))
big = c.resize((c.width * 6, c.height * 6), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=4, percent=60, threshold=2))
big.save('thu_big.png')
out = remove(big, session=new_session('isnet-general-use'))
a = np.array(out)
alpha = (a[..., 3] > 128).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(alpha)
# keep the component closest to the centre (the Thursday bottle)
cx = big.width / 2
best = min(range(1, n), key=lambda i: abs(stats[i, 0] + stats[i, 2] / 2 - cx) - stats[i, 4] * 1e-6)
keep = cv2.dilate((lab == best).astype(np.uint8), np.ones((5, 5), np.uint8))
a[..., 3] = (a[..., 3] * keep).astype(np.uint8)
Image.fromarray(a).save('cut/thursday.png')
print(big.size, Image.fromarray(a).getbbox())
