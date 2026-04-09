"""
Genera iconos de app en alta resolución (no reescalando el favicon 32×32).
Ejecutar desde la raíz del proyecto: python scripts/generate-app-icons.py
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def vertical_gradient_rgb(size: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w = h = size
    im = Image.new("RGB", (w, h))
    pix = im.load()
    r1, g1, b1 = top
    r2, g2, b2 = bottom
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        for x in range(w):
            pix[x, y] = (r, g, b)
    return im


def draw_icon_master(size: int) -> Image.Image:
    """Icono nítido a 'size' px; colores alineados con style.css (--primary, hero)."""
    top = hex_rgb("#6c47ff")
    bottom = hex_rgb("#2563d4")
    img = vertical_gradient_rgb(size, top, bottom).convert("RGBA")
    draw = ImageDraw.Draw(img)

    # Cuerpo calculadora (blanco), proporción fija respecto al canvas
    m = int(size * 0.10)
    bw = size - 2 * m
    bh = int(size * 0.72)
    bx0 = m
    by0 = m + (size - 2 * m - bh) // 2
    r_body = int(size * 0.09)

    draw.rounded_rectangle(
        [bx0, by0, bx0 + bw, by0 + bh],
        radius=r_body,
        fill=(255, 255, 255, 255),
    )

    # Pantalla
    pad = int(size * 0.06)
    sx0 = bx0 + pad
    sy0 = by0 + pad
    sw = bw - 2 * pad
    sh = int(bh * 0.28)
    r_scr = int(size * 0.045)
    draw.rounded_rectangle(
        [sx0, sy0, sx0 + sw, sy0 + sh],
        radius=r_scr,
        fill=(88, 28, 135, 255),
    )

    # Teclas 3×2 (círculos)
    key_y0 = sy0 + sh + int(size * 0.055)
    cols, rows = 3, 2
    gap = int(size * 0.035)
    avail_w = sw - gap * (cols - 1)
    key = min(avail_w // cols, int((by0 + bh - key_y0 - pad - gap * (rows - 1)) / rows))
    key = max(key, 4)
    total_w = cols * key + (cols - 1) * gap
    start_x = sx0 + (sw - total_w) // 2
    key_color = (108, 71, 255, 255)
    for row in range(rows):
        for col in range(cols):
            cx = start_x + col * (key + gap) + key // 2
            cy = key_y0 + row * (key + gap) + key // 2
            r = key // 2
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=key_color)

    return img


def supersample_then_resize(master_px: int, out_px: int) -> Image.Image:
    """Dibuja grande y reduce = bordes suaves en PNG finales."""
    big = draw_icon_master(master_px)
    return big.resize((out_px, out_px), Image.Resampling.LANCZOS)


def main() -> None:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    # Master interno alto para suavizado; salida 512 y derivados
    master = 1024

    icon512 = supersample_then_resize(master, 512)
    icon512.save(os.path.join(root, "icon-512.png"), "PNG")

    icon192 = icon512.resize((192, 192), Image.Resampling.LANCZOS)
    icon192.save(os.path.join(root, "icon-192.png"), "PNG")

    apple180 = icon512.resize((180, 180), Image.Resampling.LANCZOS)
    apple180.save(os.path.join(root, "apple-touch-icon.png"), "PNG")

    fav32 = icon512.resize((32, 32), Image.Resampling.LANCZOS)
    fav32.save(os.path.join(root, "favicon.png"), "PNG")

    # favicon.ico multi-size opcional
    ico_im = Image.new("RGBA", (32, 32))
    ico_im.paste(fav32)
    ico_im.save(os.path.join(root, "favicon.ico"), format="ICO", sizes=[(32, 32)])

    print("OK:", root)
    print("  icon-512.png, icon-192.png, apple-touch-icon.png, favicon.png, favicon.ico")


if __name__ == "__main__":
    main()
