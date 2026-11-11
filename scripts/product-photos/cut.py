import sys
from rembg import remove, new_session
from PIL import Image
sess = new_session(sys.argv[1] if len(sys.argv)>1 else "isnet-general-use")
import os
os.makedirs("cut", exist_ok=True)
for d in ["monday","tuesday","wednesday","friday","saturday","sunday"]:
    im = Image.open(os.path.join(os.path.dirname(__file__), "../../public/images", f"{d}.jpg")).convert("RGB")
    out = remove(im, session=sess, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=15, alpha_matting_erode_size=8)
    out.save(f"cut/{d}.png"); print(d, out.getbbox())
