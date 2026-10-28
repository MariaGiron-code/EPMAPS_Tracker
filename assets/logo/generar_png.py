"""Regenera los PNG del logo EPMAPS_Tracker desde la geometría del SVG oficial.

Fuente de verdad: epmaps-tracker-logo.svg (en esta misma carpeta).
Salidas (en esta misma carpeta):
  epmaps-tracker-logo.png       1200x360 (2x), fondo transparente
  epmaps-tracker-logo-1x.png     600x180 (1x), fondo transparente
  epmaps-tracker-icon.png       1024x1024, fondo #1C1C1E, solo el símbolo

Uso:  python generar_png.py
Requiere solo Pillow. No es una dependencia de la app (RNF-D-01).
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.dirname(os.path.abspath(__file__))
BLUE = (0, 90, 169, 255)      # #005AA9
RED = (230, 57, 70, 255)      # #E63946
WHITE = (255, 255, 255, 255)  # #FFFFFF
DARK = (51, 51, 51, 255)      # #333333
BG = (28, 28, 30, 255)        # #1C1C1E fondo oscuro de la app

FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG = r"C:\Windows\Fonts\segoeui.ttf"

# Geometría del SVG (espacio 600x180, símbolo con translate(20,20))
PIN_START = (60, 0)
PIN_SEGS = [
    ((27, 0), (0, 27), (0, 60)),
    ((0, 105), (60, 140), (60, 140)),
    ((60, 140), (120, 105), (120, 60)),
    ((120, 27), (93, 0), (60, 0)),
]
DROP_START = (60, 28)
DROP_SEGS = [
    ((44, 48), (35, 62), (35, 77)),
    ((35, 93), (46, 104), (60, 104)),
    ((74, 104), (85, 93), (85, 77)),
    ((85, 62), (76, 48), (60, 28)),
]


def cubic(p0, p1, p2, p3, n=64):
    pts = []
    for i in range(1, n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def shape_points(start, segs):
    pts = [start]
    cur = start
    for c1, c2, end in segs:
        pts.extend(cubic(cur, c1, c2, end))
        cur = end
    return pts


def scale(pts, k, dx, dy):
    return [(x * k + dx, y * k + dy) for x, y in pts]


def draw_symbol(d, k, dx, dy):
    """Dibuja pin + gota + punto con escala k y desplazamiento (dx, dy)."""
    d.polygon(scale(shape_points(PIN_START, PIN_SEGS), k, dx, dy), fill=BLUE)
    d.polygon(scale(shape_points(DROP_START, DROP_SEGS), k, dx, dy), fill=WHITE)
    cx, cy, r = 60 * k + dx, 77 * k + dy, 10 * k
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=RED)


def render_logo(factor, supersample=3):
    """Logo completo 600x180 escalado a factor px por unidad del SVG."""
    k = factor * supersample
    img = Image.new("RGBA", (600 * k, 180 * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    draw_symbol(d, k, 20 * k, 20 * k)  # translate(20,20)

    bold = ImageFont.truetype(FONT_BOLD, round(42 * k))
    reg = ImageFont.truetype(FONT_REG, round(30 * k))
    d.text((170 * k, 65 * k), "EPMAPS", font=bold, fill=BLUE, anchor="ls")
    d.text((170 * k, 115 * k), "Tracker", font=reg, fill=DARK, anchor="ls")
    d.rounded_rectangle(
        [170 * k, 133 * k, 300 * k, 138 * k],
        radius=round(2.5 * k),
        fill=RED,
    )
    return img.resize((600 * factor, 180 * factor), Image.LANCZOS)


def render_icon(size=1024, supersample=3, margin=170):
    """Icono de la app: solo el símbolo, centrado sobre fondo oscuro."""
    k = supersample
    img = Image.new("RGBA", (size * k, size * k), BG)
    d = ImageDraw.Draw(img)
    s = (size * k - margin * k) / 140.0
    dx = (size * k - 120.0 * s) / 2
    dy = (size * k - 140.0 * s) / 2
    draw_symbol(d, s, dx, dy)
    return img.resize((size, size), Image.LANCZOS)


def main():
    outputs = {
        "epmaps-tracker-logo.png": render_logo(2),
        "epmaps-tracker-logo-1x.png": render_logo(1),
        "epmaps-tracker-icon.png": render_icon(),
    }
    for name, im in outputs.items():
        im.save(os.path.join(OUT, name))
        print(f"{name}: {im.size[0]}x{im.size[1]}")


if __name__ == "__main__":
    main()
