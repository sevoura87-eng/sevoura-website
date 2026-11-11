from rembg import remove, new_session
from PIL import Image
im = Image.open(__import__('os').path.join(__import__('os').path.dirname(__file__), '../../public/images/thursday.jpg')).convert('RGB')
out = remove(im, session=new_session('isnet-general-use'), alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=15, alpha_matting_erode_size=8)
out.save('cut/thursday.png'); print(out.getbbox())
