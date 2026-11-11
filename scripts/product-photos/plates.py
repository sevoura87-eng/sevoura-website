"""SEVOURA inner-page hero art (no products): colonnade, astrolabe, window light, botanical folio."""
import sys, math, random
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
from compose import fbm, hexc, lerp, tex_travertine

S = 2  # supersampling for line art
import os
LAYER_MODE = os.environ.get("LAYERS") == "1"   # export animatable layers instead of baking them in
EXTRA = {}                              # name -> RGBA uint8 array


def rgba(color, alpha, scale=1):
    H, W = alpha.shape
    arr = np.dstack([np.full((H, W), color[0]), np.full((H, W), color[1]), np.full((H, W), color[2]), np.clip(alpha, 0, 1) * 255]).astype(np.uint8)
    im = Image.fromarray(arr, "RGBA")
    return im.resize((W // scale, H // scale), Image.LANCZOS) if scale > 1 else im


def grid(W, H):
    return np.linspace(0, 1, H)[:, None], np.linspace(0, 1, W)[None, :], np.arange(W, dtype=np.float32)[None, :], np.arange(H, dtype=np.float32)[:, None]


def frond_mask(W, H, fronds, blur, seed=7):
    rnd = random.Random(seed)
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    for (x, y, ang, n, L, leaf) in fronds:
        for i in range(n):
            px, py = x + math.cos(ang) * i * L / n, y + math.sin(ang) * i * L / n
            for side in (-1, 1):
                a2 = ang + side * (1.15 - i / n * 0.5) + rnd.uniform(-0.05, 0.05)
                ll = leaf * math.sin(math.pi * (i + 1) / (n + 1)) + leaf * 0.15
                wd = leaf * 0.06
                pts = []
                for k in range(0, 13):
                    t = k / 12
                    w = math.sin(math.pi * t) * wd
                    pts.append((px + math.cos(a2) * ll * t - math.sin(a2) * w, py + math.sin(a2) * ll * t + math.cos(a2) * w))
                for k in range(12, -1, -1):
                    t = k / 12
                    w = math.sin(math.pi * t) * wd
                    pts.append((px + math.cos(a2) * ll * t + math.sin(a2) * w, py + math.sin(a2) * ll * t - math.cos(a2) * w))
                d.polygon(pts, fill=255)
        d.line([(x, y), (x + math.cos(ang) * L, y + math.sin(ang) * L)], fill=255, width=max(3, int(leaf * 0.03)))
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255


def finish(img, seed, edge=None, fall=0.0):
    H, W = img.shape[:2]
    yy, xx, _, _ = grid(W, H)
    if edge is not None and fall:
        e = np.clip(np.sqrt(((xx - 0.5) * 1.3) ** 2 + ((yy - 0.5) * 1.3) ** 2), 0, 1)
        f = np.clip((e - 0.5) / 0.5, 0, 1) ** 1.5 * fall
        img = img * (1 - f[..., None]) + hexc(edge) * f[..., None]
    rng = np.random.default_rng(seed)
    img = img + rng.standard_normal((H, W, 1)).astype(np.float32) * 2.2
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


# ---------------------------------------------------------------- colonnade
def colonnade(tone="ivory", start=0.38, count=4):
    W, H = 2400, 1300
    yy, xx, X, Y = grid(W, H)
    pal = {
        "ivory": dict(wall=("#F2E8D8", "#D9C6A9"), sky=("#FFF6E2", "#F3D9A8"), reveal="#C9B08C", floor=("#EFE2CC", "#C9AF88"), edge="#F3EADD", beam=34),
        "dusk": dict(wall=("#5A1A34", "#2A0712"), sky=("#F6D29B", "#B9563F"), reveal="#3A0C1E", floor=("#6E3546", "#2A0A15"), edge="#26000D", beam=46),
    }[tone]
    horizon = int(H * 0.74)
    wall = lerp(hexc(pal["wall"][0]), hexc(pal["wall"][1]), np.broadcast_to(yy ** 1.1, (H, W)))
    wall *= (0.96 + 0.08 * fbm(W, H, 3, 6, 4))[..., None]
    img = wall.copy()
    # floor in perspective
    tex = tex_travertine(2600, 800, 5, pal["floor"][0], pal["floor"][1])
    src = np.float32([[0, 0], [2600, 0], [2600, 800], [0, 800]])
    dst = np.float32([[-200, horizon], [W + 200, horizon], [W + 1600, H + 300], [-1600, H + 300]])
    floor = cv2.warpPerspective(tex, cv2.getPerspectiveTransform(src, dst), (W, H), borderMode=cv2.BORDER_REPLICATE)
    floor = np.nan_to_num(floor)
    fm = (Y >= horizon).astype(np.float32)
    fm = np.broadcast_to(fm, (H, W))
    floor *= (0.78 + 0.25 * np.clip((Y - horizon) / (H - horizon), 0, 1))[..., None]
    img = img * (1 - fm[..., None]) + floor * fm[..., None]
    # arches on the right 62%
    n, x0, gap = count, W * start, W * 0.035
    aw = (W * 0.97 - x0 - gap * (n - 1)) / n
    atop, abot = H * 0.12, horizon
    rad = aw / 2
    open_m = np.zeros((H, W), np.float32)
    reveal_m = np.zeros((H, W), np.float32)
    for i in range(n):
        ax = x0 + i * (aw + gap)
        cx = ax + rad
        inside = ((X > ax) & (X < ax + aw) & (Y > atop + rad) & (Y < abot)) | (((X - cx) ** 2 + (Y - (atop + rad)) ** 2) < rad ** 2)
        open_m = np.maximum(open_m, inside.astype(np.float32))
        # the jamb depth: a sliver along the left inside edge
        th = aw * 0.12
        inner = ((X > ax + th) & (X < ax + aw) & (Y > atop + rad) & (Y < abot)) | (((X - cx - th * 0.5) ** 2 + (Y - (atop + rad + th * 0.3)) ** 2) < (rad - th * 0.6) ** 2)
        reveal_m = np.maximum(reveal_m, (inside & ~inner).astype(np.float32))
    open_m = cv2.GaussianBlur(open_m, (0, 0), 1.0)
    reveal_m = cv2.GaussianBlur(reveal_m, (0, 0), 1.0)
    sky = lerp(hexc(pal["sky"][0]), hexc(pal["sky"][1]), np.broadcast_to(np.clip((yy - 0.1) / 0.65, 0, 1), (H, W)))
    # distant garden silhouette (soft) inside the openings
    hills = fbm(W, H, 11, 4, 3, (1.0, 0.2))
    ground = (Y > horizon - 120 - 90 * hills).astype(np.float32)
    ground = cv2.GaussianBlur(ground, (0, 0), 6)
    sky = sky * (1 - ground[..., None] * 0.12)
    img = img * (1 - open_m[..., None]) + sky * open_m[..., None]
    img = img * (1 - reveal_m[..., None]) + hexc(pal["reveal"]) * (0.9 + 0.1 * fbm(W, H, 4, 4, 6))[..., None] * reveal_m[..., None]
    # light shafts through the openings onto the floor (projected down-left)
    beam = np.zeros((H, W), np.float32)
    for i in range(n):
        ax = x0 + i * (aw + gap)
        pts = np.array([[ax + aw * 0.1, horizon], [ax + aw * 0.95, horizon], [ax + aw * 0.95 - 520, H + 40], [ax + aw * 0.1 - 760, H + 40]], np.int32)
        cv2.fillConvexPoly(beam, pts, 1.0)
    beam = cv2.GaussianBlur(beam, (0, 0), 22) * fm
    if LAYER_MODE:
        EXTRA["beams"] = rgba((255, 236, 205), beam * pal["beam"] * 1.6 / 160, 2)
    else:
        img += (beam * pal["beam"] * 1.6)[..., None] * np.array([1, 0.9, 0.72], np.float32)
    # atmospheric glow from the openings
    glow = cv2.GaussianBlur(open_m, (0, 0), 90)
    img += (glow * 30)[..., None] * np.array([1, 0.85, 0.6], np.float32)
    # a palm outside the third arch casts its shadow into the light on the floor
    fr = frond_mask(W, H, [(x0 + 2 * (aw + gap) - 200, horizon + 40, 2.6, 18, 900, 300)], 10, 9)
    if LAYER_MODE:
        EXTRA["palm"] = rgba((60, 42, 30), 0.32 * fr * fm, 2)
    else:
        img *= (1 - 0.32 * fr * fm)[..., None]
    # cornice: gold hairline + soft shadow
    cy = int(atop - 40)
    img *= (1 - 0.12 * np.exp(-((Y - cy - 10) / 18) ** 2) * (X > x0 - 60))[..., None]
    line = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    ImageDraw.Draw(line).line([(x0 * S - 60, cy * S), (W * S, cy * S)], fill=(214, 166, 79, 190), width=2 * S)
    a = np.asarray(line.resize((W, H), Image.LANCZOS), np.float32)
    img = img * (1 - a[..., 3:4] / 255) + a[..., :3] * (a[..., 3:4] / 255)
    # wall shadow at the horizon
    img *= (1 - 0.2 * np.exp(-((Y - horizon) / 12) ** 2) * (Y < horizon + 10))[..., None]
    return finish(img, 21, pal["edge"], 0.35)


# ---------------------------------------------------------------- astrolabe (The Seven)
def sphere(img, cx, cy, r, base, env_top="#F4DDA6", env_bot="#3A0E14"):
    H, W = img.shape[:2]
    X = np.arange(W, dtype=np.float32)[None, :]; Y = np.arange(H, dtype=np.float32)[:, None]
    dx, dy = (X - cx) / r, (Y - cy) / r
    rr = dx ** 2 + dy ** 2
    msk = np.clip((1 - np.sqrt(rr)) * r / 1.2, 0, 1)
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    L = np.array([-0.55, -0.6, 0.6], np.float32); L /= np.linalg.norm(L)
    lam = np.clip(dx * L[0] + dy * L[1] + nz * L[2], 0, 1)
    h = L + np.array([0, 0, 1], np.float32); h /= np.linalg.norm(h)
    sp = np.clip(dx * h[0] + dy * h[1] + nz * h[2], 0, 1) ** 40
    env = lerp(hexc(env_top), hexc(env_bot), np.clip(dy * 0.5 + 0.5, 0, 1))
    col = env * (hexc(base) / 255) * 1.3 * (0.5 + 0.5 * lam)[..., None]
    fres = np.clip(1 - nz, 0, 1) ** 3
    col = col * (1 - fres[..., None] * 0.5) + hexc("#F2D7A0") * fres[..., None] * 0.5
    col += (sp * 140)[..., None]
    return img * (1 - msk[..., None]) + col * msk[..., None]


def astrolabe(base_only=False):
    W, H = 1500, 1800
    yy, xx, X, Y = grid(W, H)
    img = lerp(hexc("#5E1832"), hexc("#200009"), np.broadcast_to(np.clip(np.sqrt((xx - 0.5) ** 2 * 1.2 + (yy - 0.45) ** 2) * 1.4, 0, 1), (H, W)))
    img *= (0.94 + 0.12 * fbm(W, H, 13, 6, 3))[..., None]
    cx, cy = W * 0.5, H * 0.47
    # faint botanical shadow
    fr = frond_mask(W, H, [(-160, 260, 0.5, 20, 900, 280), (W + 120, H * 0.78, math.pi + 0.55, 16, 760, 240)], 14, 3)
    img *= (1 - 0.35 * fr)[..., None]
    # warm halo
    r0 = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    img += (np.exp(-((r0 / 520) ** 2)) * 26)[..., None] * np.array([1, 0.7, 0.45], np.float32)
    if LAYER_MODE:  # rings, planets and the sun are drawn live in SVG
        return finish(img, 33, "#26000D", 0.55)
    if base_only:
        return finish(img, 33, "#26000D", 0.55)
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    gold = (226, 190, 120)
    radii = [150, 215, 280, 345, 410, 475, 540]
    for i, r in enumerate(radii):
        a = 210 if i in (0, 6) else 120
        d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], outline=(*gold, a), width=S * (2 if i == 6 else 1))
    # dial ticks around the outer ring
    R = 540
    for k in range(168):
        t = k / 168 * 2 * math.pi
        L = 26 if k % 24 == 0 else (14 if k % 6 == 0 else 7)
        d.line([((cx + math.cos(t) * R) * S, (cy + math.sin(t) * R) * S), ((cx + math.cos(t) * (R + L)) * S, (cy + math.sin(t) * (R + L)) * S)], fill=(*gold, 170), width=S)
    # seven spokes (one for each day) and two crossing tilted ellipses
    for k in range(7):
        t = -math.pi / 2 + k / 7 * 2 * math.pi
        d.line([((cx + math.cos(t) * 150) * S, (cy + math.sin(t) * 150) * S), ((cx + math.cos(t) * 540) * S, (cy + math.sin(t) * 540) * S)], fill=(*gold, 60), width=S)
    for tilt in (-24, 24):
        pts = []
        for i in range(721):
            t = i / 720 * 2 * math.pi
            ex, ey = 540 * math.cos(t), 170 * math.sin(t)
            c, s_ = math.cos(math.radians(tilt)), math.sin(math.radians(tilt))
            pts.append(((cx + ex * c - ey * s_) * S, (cy + ex * s_ + ey * c) * S))
        d.line(pts, fill=(*gold, 90), width=S)
    a = np.asarray(lay.resize((W, H), Image.LANCZOS), np.float32)
    img = img * (1 - a[..., 3:4] / 255) + a[..., :3] * (a[..., 3:4] / 255)
    # the seven planets, one on each ring along a spiral, and a small sun
    img = sphere(img, cx, cy, 62, "#E6B866")
    for i, r in enumerate(radii):
        t = -math.pi / 2 + i / 7 * 2 * math.pi + 0.35
        img = sphere(img, cx + math.cos(t) * r, cy + math.sin(t) * r, 13 + i * 1.6, "#E2B464")
    return finish(img, 33, "#26000D", 0.55)


# ---------------------------------------------------------------- window light (The Experience)
def window(leaf_layer=False):
    W, H = 2400, 1200
    yy, xx, X, Y = grid(W, H)
    img = lerp(hexc("#D9BE97"), hexc("#7A4A3A"), np.broadcast_to(np.clip(np.abs(xx - 0.62) * 1.5 + yy * 0.35, 0, 1), (H, W)))
    img *= (0.95 + 0.1 * fbm(W, H, 17, 6, 4))[..., None]
    # a tall arched window of sunlight thrown across the wall
    lm = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(lm)
    x0, x1, top, bot = W * 0.5, W * 0.78, H * 0.04, H * 0.98
    d.rounded_rectangle([x0, top, x1, bot], radius=int((x1 - x0) / 2), fill=255)
    for f in (0.333, 0.666):
        d.rectangle([x0 + (x1 - x0) * f - 7, top, x0 + (x1 - x0) * f + 7, bot], fill=0)
    for f in (0.45, 0.72):
        d.rectangle([x0, top + (bot - top) * f - 6, x1, top + (bot - top) * f + 6], fill=0)
    lm = lm.transform((W, H), Image.AFFINE, (1, 0.32, -260, 0, 1, 0), resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(5))
    light = np.asarray(lm, np.float32) / 255
    fr = frond_mask(W, H, [(W * 0.88, -60, 2.3, 20, 900, 300)], 8, 5)
    if LAYER_MODE:
        EXTRA["light"] = rgba((255, 236, 200), light * 0.62, 2)
        EXTRA["leaves"] = rgba((90, 52, 40), light * fr * 0.55, 2)
        light = light * (1 - 0.85 * fr)
    else:
        light = light * (1 - 0.85 * fr)
        img = img * (1 + 0.55 * light)[..., None] + (light * 22)[..., None] * np.array([1, 0.9, 0.7], np.float32)
    # a low travertine ledge
    ledge = int(H * 0.8)
    tex = tex_travertine(W, H - ledge, 8, "#E9D6B8", "#B89C76")
    face = np.zeros_like(img); face[ledge:] = tex
    face *= (0.82 - 0.35 * np.clip((Y - ledge) / (H - ledge), 0, 1))[..., None]
    face *= (1 + 0.35 * np.roll(light, 0, axis=0) * 0)[..., None]
    m = np.broadcast_to((Y >= ledge).astype(np.float32), (H, W))
    img = img * (1 - m[..., None]) + face * m[..., None]
    img += (np.exp(-((Y - ledge) / 1.8) ** 2) * 38)[..., None]
    img *= (1 - 0.25 * np.exp(-((Y - ledge + 18) / 16) ** 2) * (Y < ledge))[..., None]
    # haze in the beam
    beam = cv2.GaussianBlur(light, (0, 0), 60)
    img += (beam * 20)[..., None]
    return finish(img, 44, "#2E0F1D", 0.65)


# ---------------------------------------------------------------- botanical folio (Journal)
def folio(leaf_layer=False):
    W, H = 1600, 1100
    yy, xx, X, Y = grid(W, H)
    img = lerp(hexc("#F4EADB"), hexc("#E2CFB3"), np.broadcast_to(np.clip(np.sqrt((xx - 0.3) ** 2 + (yy - 0.3) ** 2), 0, 1), (H, W)))
    img *= (0.97 + 0.06 * fbm(W, H, 19, 6, 5))[..., None]
    sun = np.exp(-(((xx - 0.35) / 0.35) ** 2 + ((yy - 0.35) / 0.4) ** 2))
    img *= (0.88 + 0.2 * sun)[..., None]
    fr = frond_mask(W, H, [(W + 80, -60, 2.25, 22, 1300, 360), (-60, H + 40, -0.75, 18, 900, 260)], 6, 12)
    if LAYER_MODE:
        EXTRA["leaves"] = rgba((70, 52, 36), 0.42 * fr, 2)
        return finish(img, 55)
    if leaf_layer:
        Image.fromarray(np.dstack([np.full((H, W), 70), np.full((H, W), 52), np.full((H, W), 36), np.clip(fr * 0.42, 0, 1) * 255]).astype(np.uint8), "RGBA").resize((W // 2, H // 2), Image.LANCZOS).save("plates/hero-folio-leaves.png", optimize=True)
    else:
        img *= (1 - 0.42 * fr)[..., None]
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.ellipse([(W * 0.62 - 210) * S, (H * 0.5 - 210) * S, (W * 0.62 + 210) * S, (H * 0.5 + 210) * S], outline=(167, 123, 61, 150), width=S)
    a = np.asarray(lay.resize((W, H), Image.LANCZOS), np.float32)
    img = img * (1 - a[..., 3:4] / 255) + a[..., :3] * (a[..., 3:4] / 255)
    img = sphere(img, W * 0.62 + 210 * math.cos(-0.9), H * 0.5 + 210 * math.sin(-0.9), 16, "#E2B464", "#F7E7C2", "#8A6A40")
    return finish(img, 55)


if __name__ == "__main__":
    out = sys.argv[1]
    which = sys.argv[2:] or ["colonnade", "colonnade_dusk", "astrolabe", "window", "folio"]
    for w in which:
        im = {"colonnade": lambda: colonnade("ivory", 0.52, 3), "colonnade_dusk": lambda: colonnade("dusk"), "astrolabe": astrolabe, "window": window, "folio": folio,
              "astrolabe_base": lambda: astrolabe(True), "window_base": lambda: window(True), "folio_base": lambda: folio(True)}[w]()
        suffix = "-base" if LAYER_MODE else ""
        im.save(f"{out}/hero-{w}{suffix}.jpg", quality=86, optimize=True, progressive=True)
        for k, v in EXTRA.items():
            v.save(f"{out}/hero-{w}-{k}.png", optimize=True)
        EXTRA.clear()
        print("wrote", w, im.size)
