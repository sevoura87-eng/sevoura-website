"""SEVOURA hero campaign visual: a burgundy plaster arch, a champagne-gold sun on a travertine
plinth, seven gold planets on tilted orbits and a botanical shadow. No product, no text."""
import math, random
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
from compose import fbm, hexc, lerp, tex_travertine

import sys
VAR = sys.argv[1] if len(sys.argv) > 1 else "orbit"
P = {
    "orbit": dict(w0="#5A1630", w1="#26000D", n0="#5E1A30", n1="#300512", edge="#26000D", line=(240, 214, 154), dust=True, out="hero.jpg"),
    "ivory": dict(w0="#F3E9DA", w1="#D9C6AC", n0="#EADBC4", n1="#CDB596", edge="#F3EADD", line=(167, 123, 61), dust=False, out="hero_ivory.jpg", f0="#C9A273", f1="#7A5636"),
    "moon": dict(rim="#F4EEE6", w0="#3A1530", w1="#170511", n0="#43183A", n1="#1E0716", edge="#26000D", line=(226, 220, 210), dust=True, out="hero_moon.jpg", sun="#E9E3DA", planet="#D8CFC2", f0="#7A6E78", f1="#2A1020"),
    "cleanse": dict(w0="#F5EDE1", w1="#DCCBB2", n0="#EFE3D0", n1="#D3BFA2", edge="#F3EADD", line=(167, 123, 61), dust=False, out="plate_cleanse.jpg",
                    sun_on=False, orbits_on=False, pearl=True),
    "elevate": dict(w0="#E9D3AE", w1="#B48A58", n0="#E3C99D", n1="#A87D4B", edge="#E8D9C2", line=(140, 98, 45), dust=True, out="plate_elevate.jpg",
                    sunr=0.11, orbits_on=False, f0="#B88A55", f1="#6B4526"),
    "radiate": dict(w0="#6A1B38", w1="#2A0310", n0="#7A2444", n1="#33061A", edge="#2E0F1D", line=(240, 214, 154), dust=True, out="plate_radiate.jpg",
                    sunr=0.22, orbits_on=False),
}[VAR]
W, H = 1500, 1800
S = 2  # supersampling for line art

yy = np.linspace(0, 1, H)[:, None]
xx = np.linspace(0, 1, W)[None, :]
X = np.arange(W, dtype=np.float32)[None, :]
Y = np.arange(H, dtype=np.float32)[:, None]

# ---- wall: deep burgundy plaster with a warm light pool ----
wall = lerp(hexc(P["w0"]), hexc(P["w1"]), np.broadcast_to(np.clip(np.sqrt((xx - 0.42) ** 2 * 1.4 + (yy - 0.32) ** 2), 0, 1) ** 0.9, (H, W)))
wall *= (0.94 + 0.12 * fbm(W, H, 3, 6, 3))[..., None]

# ---- arch niche ----
ax0, ax1, atop, abot = W * 0.2, W * 0.8, H * 0.08, H * 0.78
rad = (ax1 - ax0) / 2
cx = W / 2
inside = (((X > ax0) & (X < ax1) & (Y > atop + rad) & (Y < abot)) | (((X - cx) ** 2 + (Y - (atop + rad)) ** 2) < rad ** 2)).astype(np.float32)
inside = cv2.GaussianBlur(inside, (0, 0), 1.2)
niche = lerp(hexc(P["n0"]), hexc(P["n1"]), np.broadcast_to(np.clip((yy - 0.05) / 0.8, 0, 1), (H, W)))
niche *= (0.95 + 0.1 * fbm(W, H, 9, 6, 4))[..., None]
# light pool inside the niche from the upper left
pool = np.exp(-(((xx - 0.36) / 0.32) ** 2 + ((yy - 0.3) / 0.38) ** 2))
niche *= (0.8 + 0.55 * pool)[..., None]
img = wall * (1 - inside[..., None]) + niche * inside[..., None]
# recess: inner shadow along the left/top rim, lit edge on the right
inner = cv2.GaussianBlur(inside, (0, 0), 26)
img *= (1 - 0.35 * np.clip(inside - inner, 0, 1) * 2)[..., None]

# ---- botanical shadow (palm frond) falling across the niche ----
rnd = random.Random(7)
m = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(m)
def frond(x, y, ang, n, L):
    for i in range(n):
        px, py = x + math.cos(ang) * i * L / n, y + math.sin(ang) * i * L / n
        for side in (-1, 1):
            a2 = ang + side * (1.15 - i / n * 0.5)
            ll = 260 * math.sin(math.pi * (i + 1) / (n + 1)) + 40
            pts = [(px, py)]
            for k in range(1, 13):
                t = k / 12
                w = math.sin(math.pi * t) * 16
                pts.append((px + math.cos(a2) * ll * t - math.sin(a2) * w, py + math.sin(a2) * ll * t + math.cos(a2) * w))
            for k in range(12, 0, -1):
                t = k / 12
                w = math.sin(math.pi * t) * 16
                pts.append((px + math.cos(a2) * ll * t + math.sin(a2) * w, py + math.sin(a2) * ll * t - math.cos(a2) * w))
            d.polygon(pts, fill=255)
        d.ellipse([px - 5, py - 5, px + 5, py + 5], fill=255)
frond(-120, 120, 0.62, 22, 980)
frond(W + 60, 260, math.pi - 0.95, 18, 760)
m = m.filter(ImageFilter.GaussianBlur(9))
leafsh = np.asarray(m, np.float32) / 255
img *= (1 - 0.5 * leafsh * (0.4 + 0.6 * pool))[..., None]

# ---- travertine plinth (two steps) ----
def block(x0, x1, top, depth, face_h, seed, light=1.0):
    global img
    tex = tex_travertine(int(x1 - x0) + 80, 400, seed, "#F2E2C6", "#CFB28A")
    src = np.float32([[0, 0], [tex.shape[1], 0], [tex.shape[1], tex.shape[0]], [0, tex.shape[0]]])
    dst = np.float32([[x0 + 30, top], [x1 - 30, top], [x1, top + depth], [x0, top + depth]])
    Mx = cv2.getPerspectiveTransform(src, dst)
    t = cv2.warpPerspective(tex, Mx, (W, H), borderMode=cv2.BORDER_CONSTANT)
    mk = np.zeros((H, W), np.float32)
    cv2.fillConvexPoly(mk, dst.astype(np.int32), 1.0)
    mk = cv2.GaussianBlur(mk, (0, 0), 0.8)
    t *= (0.86 * light)
    t *= np.array([1.03, 0.99, 0.92], np.float32)
    img = img * (1 - mk[..., None]) + t * mk[..., None]
    ftex = tex_travertine(int(x1 - x0), int(face_h), seed + 1, "#E0C9A4", "#A98A62")
    face = np.zeros_like(img)
    face[int(top + depth):int(top + depth + face_h), int(x0):int(x0) + ftex.shape[1]] = ftex[: face[int(top + depth):int(top + depth + face_h)].shape[0]]
    fm = np.zeros((H, W), np.float32)
    fm[int(top + depth):int(top + depth + face_h), int(x0):int(x1)] = 1
    grad = np.clip((Y - (top + depth)) / face_h, 0, 1)
    face *= (0.62 - 0.28 * grad)[..., None] * light
    # light falls from the left: right side of the face darker
    face *= (1.05 - 0.25 * np.clip((X - x0) / (x1 - x0), 0, 1))[..., None]
    face *= np.array([1.04, 0.98, 0.9], np.float32)
    img = img * (1 - fm[..., None]) + face * fm[..., None]
    edge = np.exp(-((Y - (top + depth)) / 1.8) ** 2) * ((X > x0) & (X < x1))
    img += (edge * 40)[..., None]

# soft shadow of the plinth on the floor/wall
sh = np.zeros((H, W), np.float32)
cv2.rectangle(sh, (int(W * 0.12), int(H * 0.86)), (int(W * 0.95), int(H * 1.0)), 1.0, -1)
img *= (1 - 0.35 * cv2.GaussianBlur(sh, (0, 0), 40))[..., None]
block(W * 0.14, W * 0.86, H * 0.835, H * 0.05, H * 0.12, 21, 0.85)
block(W * 0.27, W * 0.73, H * 0.735, H * 0.045, H * 0.055, 31, 1.0)

# ---- the sun: polished champagne-gold sphere resting on the plinth ----
def sphere(cx, cy, r, base, light=(-0.55, -0.6, 0.6), spec=60, rim="#E9B98A"):
    global img
    dx, dy = (X - cx) / r, (Y - cy) / r
    rr = dx ** 2 + dy ** 2
    msk = np.clip((1 - np.sqrt(rr)) * r / 1.2, 0, 1)
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    L = np.array(light, np.float32); L /= np.linalg.norm(L)
    lam = np.clip(dx * L[0] + dy * L[1] + nz * L[2], 0, 1)
    hx, hy, hz = L[0], L[1], L[2] + 1
    hn = math.sqrt(hx * hx + hy * hy + hz * hz)
    sp = np.clip((dx * hx + dy * hy + nz * hz) / hn, 0, 1) ** spec
    # environment: burgundy reflected at the bottom, warm ivory at the top
    # metal: mostly environment reflection — warm sky above a dark horizon band, burgundy floor
    ry_ = -dy  # reflect vertical
    env = np.where((ry_ > 0.05)[..., None], lerp(hexc("#F4DDA6"), hexc("#B88442"), np.clip(1 - ry_, 0, 1)),
                   lerp(hexc(P.get("f0", "#8A5A30")), hexc(P.get("f1", "#3A0E14")), np.clip(-ry_ * 1.3 + 0.1, 0, 1)))
    env = cv2.GaussianBlur(env, (0, 0), max(1.0, r * 0.16))
    tint = hexc(base) / 255
    col = env * tint * 1.25 * (0.55 + 0.45 * lam)[..., None]
    fres = np.clip(1 - nz, 0, 1) ** 3
    col = col * (1 - fres[..., None] * 0.6) + hexc(rim) * fres[..., None] * 0.6
    col += (sp * 150)[..., None] * np.array([1, 0.95, 0.85], np.float32)
    img = img * (1 - msk[..., None]) + col * msk[..., None]

sunr = W * P.get("sunr", 0.17)
SUN = P.get("sun_on", True)
ORB = P.get("orbits_on", True)
sun_cx, sun_cy = W * 0.5, H * 0.758 - sunr
if SUN:
    # contact + cast shadow of the sun on the top step
    cs = np.zeros((H, W), np.float32)
    cv2.ellipse(cs, (int(sun_cx + 50), int(H * 0.757)), (int(sunr * 1.05), int(sunr * 0.09)), 0, 0, 360, 1.0, -1)
    img *= (1 - 0.45 * cv2.GaussianBlur(cs, (0, 0), 16))[..., None]
    cs = np.zeros((H, W), np.float32)
    cv2.ellipse(cs, (int(sun_cx), int(sun_cy + sunr - 3)), (int(sunr * 0.42), 7), 0, 0, 360, 1.0, -1)
    img *= (1 - 0.75 * cv2.GaussianBlur(cs, (0, 0), 5))[..., None]
    # soft glow behind the sun
    gr = np.sqrt((X - sun_cx) ** 2 + (Y - sun_cy) ** 2)
    img += (np.exp(-((gr / (sunr * 2.3)) ** 2)) * 38)[..., None] * np.array([1.0, 0.75, 0.45], np.float32)

# ---- orbits (line art at 2x) — back halves first ----
ORBITS = [  # (rx, ry, tilt_deg, planet angles)
    (W * 0.40, H * 0.085, -11, [0.35, 3.6]),
    (W * 0.33, H * 0.065, 8, [1.9, 4.6]),
    (W * 0.47, H * 0.11, -4, [2.6, 5.4, 0.9]),
]
ocx, ocy = sun_cx, sun_cy
def orbit_layer(front):
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    dl = ImageDraw.Draw(lay)
    for rx, ry, tilt, _ in ORBITS:
        ct, st = math.cos(math.radians(tilt)), math.sin(math.radians(tilt))
        pts = []
        for i in range(721):
            t = i / 720 * 2 * math.pi
            is_front = math.sin(t) > 0
            ex, ey = rx * math.cos(t), ry * math.sin(t)
            p = ((ocx + ex * ct - ey * st) * S, (ocy + ex * st + ey * ct) * S)
            if is_front == front:
                pts.append(p)
            elif pts:
                dl.line(pts, fill=(*P["line"], 200 if front else 120), width=3 * S // 2)
                pts = []
        if pts:
            dl.line(pts, fill=(*P["line"], 200 if front else 120), width=3 * S // 2)
    return lay.resize((W, H), Image.LANCZOS)

def planets(front):
    out = []
    for oi, (rx, ry, tilt, angs) in enumerate(ORBITS):
        ct, st = math.cos(math.radians(tilt)), math.sin(math.radians(tilt))
        for a in angs:
            if (math.sin(a) > 0) != front:
                continue
            ex, ey = rx * math.cos(a), ry * math.sin(a)
            r = 15 + 9 * (math.sin(a) + 1) / 2 + oi * 2
            out.append((ocx + ex * ct - ey * st, ocy + ex * st + ey * ct, r))
    return out

def composite(layer):
    global img
    a = np.asarray(layer, np.float32)
    al = a[..., 3:4] / 255
    img = img * (1 - al) + a[..., :3] * al

if ORB:
    composite(orbit_layer(False))
    for px, py, r in planets(False):
        sphere(px, py, r * 0.85, P.get("planet", "#C9974E"), spec=40)
if SUN:
    sphere(sun_cx, sun_cy, sunr, P.get("sun", "#E6B866"), spec=45, rim=P.get("rim", "#E9B98A"))
if ORB:
    composite(orbit_layer(True))
    for px, py, r in planets(True):
        sphere(px, py, r, P.get("planet", "#E2B464"), spec=40)
if P.get("pearl"):
    pr = W * 0.05
    cs = np.zeros((H, W), np.float32)
    cv2.ellipse(cs, (int(W * 0.5 + 20), int(H * 0.756)), (int(pr * 1.3), int(pr * 0.14)), 0, 0, 360, 1.0, -1)
    img *= (1 - 0.4 * cv2.GaussianBlur(cs, (0, 0), 8))[..., None]
    sphere(W * 0.5, H * 0.756 - pr, pr, "#EFE7DA", spec=30, rim="#FBF4E8")
# ---- gold hairline on the arch rim ----
rim = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
dr = ImageDraw.Draw(rim)
dr.arc([ax0 * S, atop * S, ax1 * S, (atop + 2 * rad) * S], 180, 360, fill=(214, 166, 79, 170), width=2 * S)
dr.line([(ax0 * S, (atop + rad) * S), (ax0 * S, abot * S)], fill=(214, 166, 79, 170), width=2 * S)
dr.line([(ax1 * S, (atop + rad) * S), (ax1 * S, abot * S)], fill=(214, 166, 79, 170), width=2 * S)
composite(rim.resize((W, H), Image.LANCZOS))

# ---- light beam + dust ----
beam = np.clip(1 - np.abs((X - 0.15 * W) * 0.8 - (Y - 0) * 0.55) / 420, 0, 1) * np.clip(1 - Y / (H * 0.9), 0, 1)
img += (beam * 18)[..., None] * np.array([1, 0.85, 0.6], np.float32)
rng = np.random.default_rng(5)
for _ in range(140 if P["dust"] else 0):
    x, y = rng.uniform(0, W), rng.uniform(0, H * 0.75)
    if beam[int(y), int(x)] < 0.15:
        continue
    cv2.circle(img, (int(x), int(y)), int(rng.uniform(1, 3)), (255, 236, 196), -1)

# ---- finish: edge falloff into the hero colour, film grain ----
edge = np.clip(np.sqrt(((xx - 0.5) * 1.5) ** 2 + ((yy - 0.46) * 1.15) ** 2), 0, 1)
fall = np.clip((edge - 0.55) / 0.45, 0, 1) ** 1.4
img = img * (1 - fall[..., None]) + hexc(P["edge"]) * fall[..., None]
img += rng.standard_normal((H, W, 1)).astype(np.float32) * 2.4
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(P["out"], quality=88, optimize=True, progressive=True)
print("ok")
