"""
SEVOURA product photography — background replacement.

Takes the ORIGINAL product photographs, cuts out the real bottle (rembg),
and places it, unaltered, on a rendered studio set (wall, plinth, surface
texture, light and botanical shadows) designed for each fragrance.
The bottle pixels are never redrawn, recoloured or reshaped: only scaled
uniformly (downscale only) and composited.

usage: python compose.py <cutout_dir> <out_dir>
"""
import sys, math, random
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 1500

def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

def fbm(w, h, seed, octaves=6, base=4, aniso=(1.0, 1.0)):
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        f = base * 2 ** o
        sx, sy = max(2, int(f * aniso[0])), max(2, int(f * aniso[1]))
        small = rng.random((sy, sx)).astype(np.float32)
        out += cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC) * amp
        tot += amp
        amp *= 0.55
    out /= tot
    return (out - out.min()) / (out.max() - out.min() + 1e-6)

def lerp(a, b, t):
    return a + (b - a) * t[..., None]

def grain(h, w, seed, amt):
    rng = np.random.default_rng(seed + 99)
    return (rng.standard_normal((h, w)).astype(np.float32) * amt)[..., None]

# ---------------- surface textures (flat, later warped into perspective) ----------------
def tex_travertine(w, h, seed, c1, c2):
    n = fbm(w, h, seed, 6, 3, (1.0, 0.08))           # long horizontal bedding layers
    n2 = fbm(w, h, seed + 1, 4, 2)
    t = np.clip(0.75 * n + 0.25 * n2, 0, 1)
    img = lerp(hexc(c1), hexc(c2), t * 0.7)
    pores = fbm(w, h, seed + 7, 4, 60, (1.0, 0.25))
    pm = np.clip((pores - 0.82) * 5, 0, 1)
    return img * (1 - 0.07 * pm[..., None])

def tex_walnut(w, h, seed, c1, c2):
    n = fbm(w, h, seed, 5, 2, (1.0, 0.3))
    y = np.linspace(0, 1, h)[:, None]
    g = 0.5 + 0.5 * np.sin(y * 34 + n * 4)
    streak = fbm(w, h, seed + 3, 5, 30, (0.15, 1.0))      # long fibres running left-right
    streak2 = fbm(w, h, seed + 4, 3, 90, (0.08, 1.0))
    t = np.clip(0.35 * g + 0.45 * streak + 0.2 * streak2, 0, 1)
    t = (t - t.min()) / (t.max() - t.min() + 1e-6)
    return lerp(hexc(c1), hexc(c2), t)

def tex_marble(w, h, seed, c1, c2):
    n = fbm(w, h, seed, 6, 2)
    x = np.linspace(0, 1, w)[None, :]
    v = np.abs(np.sin((x * 2.2 + n * 2.6) * math.pi))
    vein = np.clip(1 - v * 22, 0, 1)
    vein = cv2.GaussianBlur(vein, (0, 0), 1.2)
    base = lerp(hexc(c1), hexc(c2), fbm(w, h, seed + 5, 4, 2) * 0.55)
    return base * (1 - 0.10 * vein[..., None])

def tex_linen(w, h, seed, c1, c2):
    n = fbm(w, h, seed, 5, 3)
    return lerp(hexc(c1), hexc(c2), n * 0.5)

TEX = {"travertine": tex_travertine, "walnut": tex_walnut, "marble": tex_marble, "linen": tex_linen}

def perspective(tex, top_y, bot_y, inset):
    """map a flat texture onto the plinth top: a trapezoid narrowing toward the horizon"""
    th, tw = tex.shape[:2]
    src = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]])
    dst = np.float32([[inset, top_y], [W - inset, top_y], [W + 40, bot_y], [-40, bot_y]])
    M = cv2.getPerspectiveTransform(src, dst)
    return cv2.warpPerspective(tex, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

# ---------------- shadow motifs ----------------
def leaf(draw, cx, cy, length, width, ang):
    pts = []
    for i in range(41):
        t = i / 40
        r = math.sin(math.pi * t) * width * (1 - 0.35 * t)
        pts.append((t * length, r))
    pts += [(t * length, -math.sin(math.pi * t) * width * (1 - 0.35 * t)) for t in [i / 40 for i in range(40, -1, -1)]]
    ca, sa = math.cos(ang), math.sin(ang)
    draw.polygon([(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts], fill=255)

def motif(kind, seed):
    rnd = random.Random(seed)
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    if kind == "jasmine":  # a fine branch with small leaves falling from upper left
        for b in range(2):
            x, y = -80 + b * 60, 60 + b * 220
            ang = 0.55 + b * 0.12
            for s in range(18):
                nx, ny = x + math.cos(ang) * 52, y + math.sin(ang) * 52
                d.line([(x, y), (nx, ny)], fill=255, width=5)
                if s % 2 == 0:
                    side = 1 if s % 4 == 0 else -1
                    leaf(d, nx, ny, rnd.uniform(110, 150), rnd.uniform(26, 34), ang + side * rnd.uniform(0.7, 1.1))
                if s % 6 == 3:
                    for p in range(5):  # small five-petal flower
                        leaf(d, nx, ny, 40, 15, p * 2 * math.pi / 5)
                x, y = nx, ny
                ang += rnd.uniform(-0.12, 0.08)
        blur = 18
    elif kind == "tea":  # broad tea leaves from the right
        for i in range(16):
            cx, cy = W + rnd.uniform(-420, 40), rnd.uniform(-60, H * 0.62)
            leaf(d, cx, cy, rnd.uniform(220, 330), rnd.uniform(48, 70), math.pi + rnd.uniform(-0.6, 0.6))
            d.line([(cx, cy), (W + 80, cy + rnd.uniform(-60, 60))], fill=255, width=6)
        blur = 22
    elif kind == "grass":  # vetiver blades rising from the left
        for i in range(34):
            x0 = rnd.uniform(-80, 420)
            pts = []
            ang = -math.pi / 2 + rnd.uniform(-0.15, 0.55)
            x, y = x0, H * 0.78
            for s in range(30):
                pts.append((x, y))
                x += math.cos(ang) * 32
                y += math.sin(ang) * 32
                ang += rnd.uniform(0.0, 0.035)
            d.line(pts, fill=255, width=int(rnd.uniform(5, 11)))
        blur = 12
    elif kind == "slats":  # warm window-blind light for clove: we draw the LIGHT, later inverted
        for i in range(7):
            y = 120 + i * 120
            d.polygon([(-100, y), (W + 100, y - 260), (W + 100, y - 200), (-100, y + 62)], fill=255)
        blur = 10
    elif kind == "arch":  # an arched window of light
        d.rounded_rectangle([W * 0.18, H * 0.06, W * 0.82, H * 0.95], radius=int(W * 0.32), fill=255)
        d.rectangle([W * 0.49, H * 0.06, W * 0.51, H * 0.95], fill=0)
        d.rectangle([W * 0.18, H * 0.42, W * 0.82, H * 0.435], fill=0)
        m = m.transform((W, H), Image.AFFINE, (1, 0.28, -180, 0, 1, 0), resample=Image.BICUBIC)
        blur = 16
    elif kind == "petals":  # rose: soft scattered leaf/petal shadows top-right
        for i in range(10):
            cx, cy = rnd.uniform(W * 0.45, W + 80), rnd.uniform(-80, H * 0.4)
            leaf(d, cx, cy, rnd.uniform(120, 190), rnd.uniform(50, 80), rnd.uniform(0, 2 * math.pi))
        d.line([(W + 60, -40), (W * 0.55, H * 0.42)], fill=255, width=7)
        blur = 26
    else:
        blur = 1
    m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m, np.float32) / 255.0

# ---------------- scenes ----------------
SCENES = {
    "monday": dict(wall=("#F4EEE3", "#E2D6C3"), surface="linen", sc=("#EDE4D5", "#DCCDB6"), face=("#E3D6C1", "#CDBBA0"),
                   motif="jasmine", motif_op=0.20, light=(0.22, 0.12), warm=0.0, accent=None, seed=11),
    "tuesday": dict(wall=("#5A3426", "#2E1810"), surface="walnut", sc=("#3B2216", "#7A4E33"), face=("#2A170E", "#1A0D07"),
                    motif="slats", motif_op=0.28, light=(0.18, 0.2), warm=0.06, accent=None, seed=22, slat_light=True),
    "wednesday": dict(wall=("#C9CDB8", "#9FA78E"), surface="travertine", sc=("#ECE5D6", "#D8CDB7"), face=("#D9CEB8", "#BDB096"),
                      motif="tea", motif_op=0.24, light=(0.25, 0.15), warm=0.0, accent=None, seed=33),
    "friday": dict(wall=("#EFD9D2", "#D9B4AB"), surface="marble", sc=("#F5EEE8", "#E4D6CC"), face=("#E8D7CC", "#CDB4A6"),
                   motif="petals", motif_op=0.18, light=(0.7, 0.1), warm=0.02, accent="arch", seed=44),
    "saturday": dict(wall=("#C2B6A8", "#8D8073"), surface="travertine", sc=("#D9CFC0", "#B3A491"), face=("#B5A794", "#8E806D"),
                     motif="grass", motif_op=0.26, light=(0.8, 0.15), warm=0.0, accent=None, seed=55),
    "sunday": dict(wall=("#E8CFA5", "#C99A5E"), surface="walnut", sc=("#6B4329", "#9C6B45"), face=("#4A2C19", "#33200F"),
                   motif="arch", motif_op=0.0, light=(0.3, 0.08), warm=0.08, accent="sun", seed=66),
    # Thursday — Vanilla · Cocoa · Amber: warm champagne plaster, honey travertine, soft amber light through an arched window
    "thursday": dict(wall=("#F1E2C8", "#CFAE82"), surface="travertine", sc=("#F2E5CF", "#D9C29E"), face=("#DCC6A2", "#B89A70"),
                     motif="arch", motif_op=0.13, light=(0.32, 0.12), warm=0.05, accent=None, seed=77, enlarge=True),
}

HORIZON, FRONT = int(H * 0.70), int(H * 0.84)
BOTTLE_H = 900

def render(day, cut_path):
    sc = SCENES[day]
    yy = np.linspace(0, 1, H)[:, None]
    xx = np.linspace(0, 1, W)[None, :]
    # wall: vertical gradient + plaster texture + soft light pool
    wall = lerp(hexc(sc["wall"][0]), hexc(sc["wall"][1]), np.broadcast_to(yy ** 1.2, (H, W)))
    plaster = fbm(W, H, sc["seed"], 6, 3)
    wall *= (0.97 + 0.06 * plaster)[..., None]
    lx, ly = sc["light"]
    pool = np.exp(-(((xx - lx) / 0.55) ** 2 + ((yy - ly) / 0.6) ** 2))
    wall *= (0.86 + 0.24 * pool)[..., None]

    if sc["accent"] == "sun":  # champagne-gold disc rising behind the bottle
        r = np.sqrt(((xx - 0.5) * W) ** 2 + ((yy - 0.43) * H) ** 2)
        disc = np.clip((390 - r) / 3, 0, 1)
        glow = np.exp(-((r / 520) ** 2))
        gold = lerp(hexc("#F3DDAE"), hexc("#D9A75A"), np.broadcast_to(np.clip((yy - 0.2) / 0.5, 0, 1), (H, W)))
        wall = wall * (1 - disc[..., None] * 0.9) + gold * disc[..., None] * 0.9
        wall *= (1 + 0.12 * glow)[..., None]
        ring = np.clip(1 - np.abs(r - 450) / 1.6, 0, 1)
        wall = wall * (1 - ring[..., None] * 0.55) + hexc("#F6E2B2") * ring[..., None] * 0.55
    if sc["accent"] == "arch":  # a recessed arch niche behind the bottle
        ax0, ax1, atop = W * 0.24, W * 0.76, H * 0.12
        rad = (ax1 - ax0) / 2
        cx = W / 2
        X = np.arange(W)[None, :].astype(np.float32)
        Y = np.arange(H)[:, None].astype(np.float32)
        inside = ((X > ax0) & (X < ax1) & (Y > atop + rad)) | (((X - cx) ** 2 + (Y - (atop + rad)) ** 2) < rad ** 2)
        inside = cv2.GaussianBlur(inside.astype(np.float32), (0, 0), 2.0)
        wall = wall * (1 - 0.07 * inside[..., None])
        edge = cv2.GaussianBlur(inside, (0, 0), 14) - inside
        wall *= (1 + 0.5 * np.clip(edge, -0.2, 0.2)[..., None])

    if sc["motif"] and sc["motif_op"]:
        m = motif(sc["motif"], sc["seed"])
        if sc.get("slat_light"):
            wall *= (1 + sc["motif_op"] * 1.3 * m)[..., None]  # light streaks on a dark wall
        else:
            wall *= (1 - sc["motif_op"] * m)[..., None]

    img = wall
    # plinth top in perspective
    tex = TEX[sc["surface"]](1600, 700, sc["seed"] + 1, sc["sc"][0], sc["sc"][1])
    top = perspective(tex, HORIZON, FRONT, 150)
    depth = np.clip((yy - HORIZON / H) / ((FRONT - HORIZON) / H), 0, 1)
    top = top * (0.86 + 0.18 * np.broadcast_to(depth, (H, W)))[..., None]
    top *= (0.9 + 0.2 * np.exp(-(((xx - lx) / 0.7) ** 2)))[..., None]
    mask_top = ((yy >= HORIZON / H) & (yy < FRONT / H)).astype(np.float32)
    mask_top = np.broadcast_to(mask_top, (H, W))
    img = img * (1 - mask_top[..., None]) + top * mask_top[..., None]
    # plinth front face (darker, same material, vertical light falloff)
    ftex = TEX[sc["surface"]](W, H - FRONT, sc["seed"] + 2, sc["face"][0], sc["face"][1])
    face = np.zeros_like(img)
    face[FRONT:] = ftex
    face *= (1 - 0.25 * np.clip((yy - FRONT / H) / (1 - FRONT / H), 0, 1))[..., None]
    mf = (yy >= FRONT / H).astype(np.float32)
    mf = np.broadcast_to(mf, (H, W))
    img = img * (1 - mf[..., None]) + face * mf[..., None]
    # bevel highlight on the front edge and soft shadow where the wall meets the top
    edge = np.exp(-(((yy * H) - FRONT) / 2.2) ** 2)
    img = img + (np.broadcast_to(edge, (H, W))[..., None] * 28)
    seam = np.exp(-(((yy * H) - HORIZON) / 18) ** 2) * (yy * H < HORIZON + 40)
    img *= (1 - 0.18 * np.broadcast_to(seam, (H, W)))[..., None]
    # soft wall shadow cast by the plinth on the wall right above the horizon
    above = np.clip(1 - (HORIZON - yy * H) / 70, 0, 1) * (yy * H < HORIZON)
    img *= (1 - 0.12 * np.broadcast_to(above, (H, W)))[..., None]

    if sc["warm"]:  # warm grade on the SET only — the bottle is composited afterwards, untouched
        img[..., 0] *= 1 + sc["warm"] * 0.3
        img[..., 2] *= 1 - sc["warm"] * 0.3
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")

    if cut_path:
        cut = Image.open(cut_path).convert("RGBA")
        cut = cut.crop(cut.getbbox())
        # downscale only — except Thursday, whose only genuine photograph is the small bottle in the
        # gift-box shot: it is enlarged with plain Lanczos resampling (no AI detail is invented)
        s = BOTTLE_H * 0.9 / cut.height if sc.get("enlarge") else min(1.0, BOTTLE_H / cut.height)
        bw, bh = int(cut.width * s), int(cut.height * s)
        cut = cut.resize((bw, bh), Image.LANCZOS)
        base_y = HORIZON + int((FRONT - HORIZON) * 0.55)
        bx, by = (W - bw) // 2, base_y - bh
        a = np.asarray(cut.split()[-1], np.float32) / 255.0

        shadow_dir = 1 if lx < 0.5 else -1
        cxb = bx + bw // 2
        ry = max(6, int(bw * 0.07))                       # the base ellipse seen in perspective
        sh = np.zeros((H, W), np.float32)
        cv2.ellipse(sh, (cxb + shadow_dir * int(bw * 0.75), base_y - ry), (int(bw * 1.05), int(ry * 1.6)), shadow_dir * -4, 0, 360, 1.0, -1)
        sh = cv2.GaussianBlur(sh, (0, 0), 20) * 0.30
        cs = np.zeros((H, W), np.float32)
        cv2.ellipse(cs, (cxb, base_y - ry), (int(bw * 0.47), int(ry * 0.9)), 0, 0, 360, 1.0, -1)
        cs = cv2.GaussianBlur(cs, (0, 0), 3.0) * 0.55
        cs2 = np.zeros((H, W), np.float32)
        cv2.ellipse(cs2, (cxb, base_y - ry // 2), (int(bw * 0.6), int(ry * 1.6)), 0, 0, 360, 1.0, -1)
        cs2 = cv2.GaussianBlur(cs2, (0, 0), 14) * 0.22
        tot = np.clip(sh + cs + cs2, 0, 0.78)
        arr = np.asarray(out, np.float32)
        arr[..., :3] *= (1 - tot[..., None])
        out = Image.fromarray(arr.astype(np.uint8), "RGBA")
        out.alpha_composite(cut, (bx, by))
        bottle_mask = np.zeros((H, W), np.float32)
        bottle_mask[by:by + bh, bx:bx + bw] = a
    else:
        bottle_mask = np.zeros((H, W), np.float32)

    # final: gentle vignette + fine film grain for a photographic finish
    arr = np.asarray(out.convert("RGB"), np.float32)
    orig = arr.copy()
    vig = 1 - 0.18 * (((xx - 0.5) * 1.6) ** 2 + ((yy - 0.48) * 1.3) ** 2)
    arr *= np.clip(vig, 0.75, 1)[..., None]
    arr += grain(H, W, sc["seed"], 2.2)
    arr = arr * (1 - bottle_mask[..., None]) + orig * bottle_mask[..., None]  # bottle pixels stay original
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

if __name__ == "__main__":
    cut_dir, out_dir = sys.argv[1], sys.argv[2]
    days = sys.argv[3:] or list(SCENES)
    for d in days:
        p = f"{cut_dir}/{d}.png"
        im = render(d, p)
        im.save(f"{out_dir}/{d}.jpg", quality=90, optimize=True, progressive=True)
        print("wrote", d)
