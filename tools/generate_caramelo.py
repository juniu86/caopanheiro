#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gerador de assets do Caramelo — raça-piloto.
Produz 6 PNGs 1024x1024 RGBA com ilustração 2D cozy programática.

Cada estado tem pose e expressão distintas mantendo a mesma anatomia,
paleta, escala (~70% da altura do canvas) e baseline.
"""
from PIL import Image, ImageDraw
import math
import os

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'img', 'breeds')
SIZE = 1024
# Baseline: pés a ~92% (margem inferior ~8%, conforme spec)
BASELINE = int(SIZE * 0.92)
# Escala: porte médio/viralata = ~70% da altura
DOG_HEIGHT = int(SIZE * 0.70)
DOG_TOP = BASELINE - DOG_HEIGHT
# Scale factor — applied to all body part sizes to fill ~70% of canvas
S = 1.85

# Paleta caramelo — cel-shading 2 tons + highlight
BODY = (218, 165, 42)       # caramelo principal
BODY_DARK = (180, 130, 30)  # sombra
BODY_LIGHT = (235, 195, 90) # highlight
BELLY = (240, 210, 140)     # barriga/peito claro
NOSE = (30, 25, 20)         # nariz/olhos
EYE_WHITE = (255, 255, 255)
EYE_IRIS = (65, 45, 25)
EYE_PUPIL = (20, 15, 10)
EYE_HIGHLIGHT = (255, 255, 255)
TONGUE = (230, 110, 130)
MOUTH = (100, 65, 35)
BLUSH = (230, 140, 130, 80)
INNER_EAR = (200, 150, 80)


def ellipse(draw, cx, cy, rx, ry, fill, outline=None):
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=fill, outline=outline)


def rounded_rect(draw, x, y, w, h, r, fill):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill)


def draw_leg(draw, x, y, w, h, color, paw_color):
    """Perna com pata arredondada."""
    rounded_rect(draw, x, y, w, h, w // 3, color)
    ellipse(draw, x + w // 2, y + h, w // 2 + 2, 6, paw_color)


def draw_ear_semi_erect(draw, x, y, size, flip, body, dark, inner):
    """Orelha semi-ereta com ponta dobrada (característica do caramelo)."""
    pts = [(x, y)]
    if flip:
        pts += [(x + size * 0.7, y - size * 0.9), (x + size * 0.5, y - size * 0.5),
                (x + size, y + size * 0.1), (x + size * 0.3, y + size * 0.4)]
    else:
        pts += [(x - size * 0.7, y - size * 0.9), (x - size * 0.5, y - size * 0.5),
                (x - size, y + size * 0.1), (x - size * 0.3, y + size * 0.4)]
    draw.polygon(pts, fill=body, outline=dark)
    # Inner ear
    inner_pts = [(p[0] * 0.85 + x * 0.15, p[1] * 0.85 + y * 0.15) for p in pts[1:4]]
    if len(inner_pts) >= 3:
        draw.polygon(inner_pts, fill=inner)


def draw_tail(draw, x, y, curve_up, body, dark):
    """Cauda curvada para cima."""
    pts = []
    for t in range(20):
        frac = t / 19
        tx = x + frac * 60
        ty = y - math.sin(frac * math.pi * 0.8) * curve_up
        pts.append((tx, ty))
    # Draw thick line via multiple ellipses
    for i, (px, py) in enumerate(pts):
        r = 10 - i * 0.3
        if r < 3:
            r = 3
        c = dark if i < 5 else body
        ellipse(draw, int(px), int(py), int(r), int(r), c)


def draw_eye(draw, cx, cy, size, mood='happy', looking='forward'):
    """Olho com expressão por mood."""
    if mood == 'sleeping':
        # Olho fechado — linha curva
        draw.arc([cx - size, cy - size // 3, cx + size, cy + size // 3],
                 0, 180, fill=EYE_IRIS, width=3)
        return
    if mood == 'sad' or mood == 'sick':
        # Olho semi-cerrado
        ellipse(draw, cx, cy, size, size, EYE_WHITE)
        ellipse(draw, cx, cy, size * 0.65, size * 0.7, EYE_IRIS)
        ellipse(draw, cx - 1, cy, size * 0.4, size * 0.45, EYE_PUPIL)
        ellipse(draw, cx - size * 0.3, cy - size * 0.3, 3, 3, EYE_HIGHLIGHT)
        # Pálpebra caída
        draw.pieslice([cx - size - 2, cy - size - 2, cx + size + 2, cy + size + 2],
                      180, 330, fill=BODY)
        return

    # Normal/happy/hungry
    s = size if mood != 'hungry' else size * 1.15
    ellipse(draw, cx, cy, int(s), int(s * 1.1), EYE_WHITE)
    iris_off = -2 if looking == 'up' else 0
    ellipse(draw, cx, cy + iris_off, int(s * 0.65), int(s * 0.7), EYE_IRIS)
    ellipse(draw, cx - 1, cy + iris_off, int(s * 0.4), int(s * 0.45), EYE_PUPIL)
    ellipse(draw, cx - int(s * 0.3), cy - int(s * 0.3) + iris_off, 3, 3, EYE_HIGHLIGHT)
    if mood == 'happy':
        # Brilho extra
        ellipse(draw, cx + int(s * 0.15), cy - int(s * 0.15), 2, 2, (255, 255, 255, 180))


def draw_nose(draw, cx, cy):
    ellipse(draw, cx, cy, 14, 10, NOSE)
    ellipse(draw, cx - 4, cy - 3, 4, 3, (60, 50, 40))


def draw_mouth(draw, nx, ny, open_mouth=False, tongue=False, licking=False):
    if open_mouth:
        # Boca aberta sorrindo
        draw.arc([nx - 15, ny, nx + 25, ny + 30], 0, 180, fill=MOUTH, width=2)
        if tongue:
            ellipse(draw, nx + 5, ny + 22, 10, 16, TONGUE)
            draw.line([(nx + 5, ny + 10), (nx + 5, ny + 30)], fill=(200, 80, 100), width=1)
    elif licking:
        draw.arc([nx - 10, ny, nx + 20, ny + 20], 0, 180, fill=MOUTH, width=2)
        ellipse(draw, nx - 8, ny + 10, 8, 14, TONGUE)
    else:
        # Boca fechada
        draw.arc([nx - 10, ny + 2, nx + 15, ny + 15], 10, 170, fill=MOUTH, width=2)


def make_caramelo(state):
    """Gera um PNG 1024x1024 RGBA do caramelo no estado dado."""
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Centro horizontal do cachorro
    cx = SIZE // 2

    if state == 'dormindo':
        return draw_sleeping(img, draw, cx)
    elif state == 'doente':
        return draw_sick(img, draw, cx)
    elif state == 'triste':
        return draw_sad(img, draw, cx)
    elif state == 'com_fome':
        return draw_hungry(img, draw, cx)
    elif state == 'neutro':
        return draw_neutral(img, draw, cx)
    else:  # feliz
        return draw_happy(img, draw, cx)


def si(v):
    """Scale and int."""
    return int(v * S)


def draw_standing_body(draw, cx, body_y, body_rx=None, body_ry=None):
    """Corpo base do caramelo em pé/sentado — reutilizado por vários estados."""
    rx = body_rx or si(110)
    ry = body_ry or si(70)
    ellipse(draw, cx, body_y, rx, ry, BODY)
    ellipse(draw, cx, body_y + si(15), rx - si(15), ry - si(25), BODY_DARK)
    ellipse(draw, cx - si(40), body_y - si(10), si(45), si(40), BELLY)
    return body_y


def draw_head(draw, hx, hy, hr=65):
    """Cabeça base — retorna posições para olho, nariz, orelhas."""
    ellipse(draw, hx, hy, hr, int(hr * 0.9), BODY)
    ellipse(draw, hx, hy, hr, int(hr * 0.9), BODY_LIGHT)
    # Focinho (protuberância)
    ellipse(draw, hx - 25, hy + 15, 35, 25, BODY_LIGHT)
    return {
        'eye_x': hx + 10, 'eye_y': hy - 8,
        'nose_x': hx - 40, 'nose_y': hy + 10,
        'ear_l': (hx - 35, hy - hr + 15),
        'ear_r': (hx + 35, hy - hr + 15),
    }


def draw_happy(img, draw, cx):
    body_y = BASELINE - si(160)
    draw_tail(draw, cx + si(90), body_y - si(30), si(80), BODY, BODY_DARK)
    draw_leg(draw, cx + si(50), BASELINE - si(110), si(30), si(100), BODY_DARK, BODY)
    draw_leg(draw, cx + si(85), BASELINE - si(105), si(28), si(95), BODY_DARK, BODY)
    draw_standing_body(draw, cx, body_y)
    draw_leg(draw, cx - si(75), BASELINE - si(120), si(30), si(110), BODY, BODY_DARK)
    draw_leg(draw, cx - si(40), BASELINE - si(125), si(30), si(115), BODY, BODY_DARK)
    ellipse(draw, cx - si(50), body_y - si(50), si(50), si(55), BODY)
    hx, hy = cx - si(50), body_y - si(120)
    parts = draw_head(draw, hx, hy, si(65))
    draw_ear_semi_erect(draw, parts['ear_l'][0], parts['ear_l'][1], si(45), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, parts['ear_r'][0], parts['ear_r'][1], si(45), True, BODY, BODY_DARK, INNER_EAR)
    draw_eye(draw, parts['eye_x'], parts['eye_y'], si(16), 'happy')
    draw_nose(draw, parts['nose_x'], parts['nose_y'])
    draw_mouth(draw, parts['nose_x'] + si(5), parts['nose_y'] + si(12), open_mouth=True, tongue=True)
    ellipse(draw, hx + si(25), hy + si(15), si(12), si(8), BLUSH)
    return img


def draw_sad(img, draw, cx):
    body_y = BASELINE - si(130)
    for t in range(15):
        frac = t / 14
        tx = cx + si(90) + frac * si(40)
        ty = body_y + si(10) + frac * si(30)
        r = max(3, si(9) - t * 0.7)
        ellipse(draw, int(tx), int(ty), int(r), int(r), BODY_DARK)
    draw_leg(draw, cx + si(40), BASELINE - si(85), si(30), si(75), BODY_DARK, BODY)
    draw_leg(draw, cx + si(70), BASELINE - si(80), si(28), si(70), BODY_DARK, BODY)
    ellipse(draw, cx, body_y, si(105), si(65), BODY)
    ellipse(draw, cx, body_y + si(15), si(90), si(40), BODY_DARK)
    ellipse(draw, cx - si(35), body_y - si(8), si(40), si(35), BELLY)
    draw_leg(draw, cx - si(65), BASELINE - si(100), si(28), si(90), BODY, BODY_DARK)
    draw_leg(draw, cx - si(35), BASELINE - si(105), si(28), si(95), BODY, BODY_DARK)
    ellipse(draw, cx - si(45), body_y - si(40), si(45), si(50), BODY)
    hx, hy = cx - si(50), body_y - si(95)
    parts = draw_head(draw, hx, hy, si(60))
    draw_ear_semi_erect(draw, parts['ear_l'][0], parts['ear_l'][1] + si(8), si(40), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, parts['ear_r'][0], parts['ear_r'][1] + si(8), si(40), True, BODY, BODY_DARK, INNER_EAR)
    draw_eye(draw, parts['eye_x'], parts['eye_y'] + si(5), si(14), 'sad')
    draw_nose(draw, parts['nose_x'], parts['nose_y'])
    draw_mouth(draw, parts['nose_x'] + si(5), parts['nose_y'] + si(12))
    return img


def draw_hungry(img, draw, cx):
    body_y = BASELINE - si(155)
    draw_tail(draw, cx + si(85), body_y - si(25), si(70), BODY, BODY_DARK)
    draw_leg(draw, cx + si(45), BASELINE - si(108), si(30), si(98), BODY_DARK, BODY)
    draw_leg(draw, cx + si(78), BASELINE - si(103), si(28), si(93), BODY_DARK, BODY)
    draw_standing_body(draw, cx, body_y)
    draw_leg(draw, cx - si(70), BASELINE - si(118), si(30), si(108), BODY, BODY_DARK)
    rounded_rect(draw, cx - si(45), BASELINE - si(200), si(28), si(80), si(8), BODY)
    ellipse(draw, cx - si(31), BASELINE - si(205), si(16), si(10), BODY_DARK)
    ellipse(draw, cx - si(48), body_y - si(50), si(48), si(53), BODY)
    hx, hy = cx - si(48), body_y - si(125)
    parts = draw_head(draw, hx, hy, si(65))
    draw_ear_semi_erect(draw, parts['ear_l'][0], parts['ear_l'][1], si(45), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, parts['ear_r'][0], parts['ear_r'][1], si(45), True, BODY, BODY_DARK, INNER_EAR)
    draw_eye(draw, parts['eye_x'], parts['eye_y'], si(18), 'hungry', 'up')
    draw_nose(draw, parts['nose_x'], parts['nose_y'])
    draw_mouth(draw, parts['nose_x'] + si(5), parts['nose_y'] + si(12), licking=True)
    return img


def draw_sick(img, draw, cx):
    body_y = BASELINE - si(75)
    ellipse(draw, cx, body_y, si(145), si(62), BODY)
    ellipse(draw, cx, body_y + si(14), si(130), si(42), BODY_DARK)
    ellipse(draw, cx - si(50), body_y - si(5), si(50), si(35), BELLY)
    paw_y = BASELINE - si(12)
    rounded_rect(draw, cx + si(55), paw_y - si(25), si(70), si(28), si(10), BODY_DARK)
    ellipse(draw, cx + si(123), paw_y - si(4), si(15), si(8), BODY)
    rounded_rect(draw, cx - si(115), paw_y - si(22), si(65), si(26), si(10), BODY)
    ellipse(draw, cx - si(115), paw_y - si(2), si(14), si(8), BODY_DARK)
    for t in range(12):
        frac = t / 11
        tx = cx + si(135) + frac * si(30)
        ty = body_y + si(5) + frac * si(20)
        r = max(3, si(8) - t * 0.7)
        ellipse(draw, int(tx), int(ty), int(r), int(r), BODY_DARK)
    ellipse(draw, cx - si(90), body_y - si(35), si(48), si(48), BODY)
    hx, hy = cx - si(115), body_y - si(80)
    parts = draw_head(draw, hx, hy, si(58))
    draw_ear_semi_erect(draw, parts['ear_l'][0], parts['ear_l'][1] + si(10), si(38), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, parts['ear_r'][0], parts['ear_r'][1] + si(10), si(38), True, BODY, BODY_DARK, INNER_EAR)
    draw_eye(draw, parts['eye_x'], parts['eye_y'], si(13), 'sick')
    draw_nose(draw, parts['nose_x'], parts['nose_y'])
    draw_mouth(draw, parts['nose_x'] + si(5), parts['nose_y'] + si(10))
    ellipse(draw, hx + si(30), hy + si(20), si(15), si(10), (230, 140, 130, 100))
    return img


def draw_sleeping(img, draw, cx):
    body_y = BASELINE - si(65)
    ellipse(draw, cx, body_y, si(165), si(68), BODY)
    ellipse(draw, cx + si(10), body_y + si(12), si(150), si(48), BODY_DARK)
    ellipse(draw, cx - si(35), body_y - si(8), si(58), si(38), BELLY)
    for t in range(18):
        frac = t / 17
        angle = frac * math.pi * 1.2
        tx = cx + si(115) + math.cos(angle) * si(48)
        ty = body_y - si(28) + math.sin(angle) * si(32)
        r = max(3, si(10) - t * 0.7)
        ellipse(draw, int(tx), int(ty), int(r), int(r), BODY if t % 2 == 0 else BODY_DARK)
    paw_y = BASELINE - si(10)
    rounded_rect(draw, cx + si(72), paw_y - si(24), si(58), si(24), si(8), BODY_DARK)
    ellipse(draw, cx + si(128), paw_y - si(4), si(13), si(7), BODY)
    rounded_rect(draw, cx - si(105), paw_y - si(20), si(55), si(22), si(8), BODY)
    ellipse(draw, cx - si(108), paw_y - si(2), si(13), si(7), BODY_DARK)
    hx, hy = cx - si(100), body_y - si(48)
    ellipse(draw, hx, hy, si(60), si(52), BODY_LIGHT)
    ellipse(draw, hx, hy, si(60), si(52), BODY)
    ellipse(draw, hx - si(28), hy + si(15), si(34), si(24), BODY_LIGHT)
    draw_nose(draw, hx - si(44), hy + si(12))
    draw_eye(draw, hx + si(12), hy - si(5), si(14), 'sleeping')
    draw_ear_semi_erect(draw, hx - si(34), hy - si(44), si(38), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, hx + si(34), hy - si(46), si(38), True, BODY, BODY_DARK, INNER_EAR)
    draw_mouth(draw, hx - si(36), hy + si(22))
    return img


def draw_neutral(img, draw, cx):
    body_y = BASELINE - si(155)
    draw_tail(draw, cx + si(88), body_y - si(20), si(50), BODY, BODY_DARK)
    draw_leg(draw, cx + si(48), BASELINE - si(108), si(30), si(98), BODY_DARK, BODY)
    draw_leg(draw, cx + si(82), BASELINE - si(103), si(28), si(93), BODY_DARK, BODY)
    draw_standing_body(draw, cx, body_y)
    draw_leg(draw, cx - si(73), BASELINE - si(118), si(30), si(108), BODY, BODY_DARK)
    draw_leg(draw, cx - si(40), BASELINE - si(120), si(30), si(110), BODY, BODY_DARK)
    ellipse(draw, cx - si(48), body_y - si(48), si(48), si(52), BODY)
    hx, hy = cx - si(48), body_y - si(118)
    parts = draw_head(draw, hx, hy, si(65))
    draw_ear_semi_erect(draw, parts['ear_l'][0], parts['ear_l'][1], si(45), False, BODY, BODY_DARK, INNER_EAR)
    draw_ear_semi_erect(draw, parts['ear_r'][0], parts['ear_r'][1], si(45), True, BODY, BODY_DARK, INNER_EAR)
    draw_eye(draw, parts['eye_x'], parts['eye_y'], si(15), 'neutral')
    draw_nose(draw, parts['nose_x'], parts['nose_y'])
    draw_mouth(draw, parts['nose_x'] + si(5), parts['nose_y'] + si(12))
    return img


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    estados = ['feliz', 'triste', 'com_fome', 'doente', 'dormindo', 'neutro']
    for estado in estados:
        fname = f'caramelo_{estado}.png'
        path = os.path.join(OUT_DIR, fname)
        img = make_caramelo(estado)
        img.save(path, 'PNG', optimize=True)
        kb = os.path.getsize(path) // 1024
        print(f'  OK: {fname} ({kb}KB)')
    print(f'\n{len(estados)} assets gerados em {OUT_DIR}/')


if __name__ == '__main__':
    main()
