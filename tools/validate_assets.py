#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QA técnico dos assets finais dos cães — Meu Cãopanheiro.

Valida cada PNG em img/breeds/ contra a especificação de
docs/ASSET_PROMPTS.md e gera relatório go/no-go.

Uso:
    python3 tools/validate_assets.py            # valida tudo
    python3 tools/validate_assets.py caramelo   # valida só uma raça (por prefixo)

Critérios (asset REPROVADO se falhar qualquer um):
    1.  Arquivo existe com o nome exato esperado
    2.  PNG válido, exatamente 1024×1024
    3.  Color type 6 (RGBA) — canal alpha REAL no arquivo
    4.  Bordas transparentes: ≥95% dos pixels das 4 bordas com alpha 0
        (garante fundo transparente real e personagem não cortado)
    5.  Sem checkerboard: cantos não contêm pares branco/cinza opacos
    6.  Conteúdo presente: ≥3% dos pixels do miolo são opacos
        (rejeita arquivo vazio/transparente demais)
    7.  Margem inferior: existe conteúdo opaco entre 88% e 97% da
        altura (pés ancorados perto da base, com ~8% de margem)
    8.  Peso ≤ 1600 KB
Sem dependências externas (stdlib apenas).
"""
import os
import re
import struct
import sys
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BREEDS_DIR = os.path.join(ROOT, 'img', 'breeds')
DOC = os.path.join(ROOT, 'docs', 'ASSET_PROMPTS.md')

ESTADOS = ['feliz', 'triste', 'com_fome', 'doente', 'dormindo', 'neutro']
MAX_KB = 1600


def expected_files():
    """Extrai os prefixos das tabelas de raça do ASSET_PROMPTS.md."""
    with open(DOC, encoding='utf-8') as f:
        doc = f.read()
    portes = ('Pequeno', 'Médio', 'Grande', 'Gigante', 'Vira-lata (médio)')
    rows = re.findall(
        r'^\| `([a-z_]+)` \| `([^`]+)` \| ([^|]+) \| ([^|]+) \| [^|]+ \|$',
        doc, re.M)
    prefixes = [r[1].strip() for r in rows if r[3].strip() in portes]
    assert len(prefixes) == 31, f'Esperava 31 raças no doc, achei {len(prefixes)}'
    return [f'{p}_{e}.png' for p in prefixes for e in ESTADOS]


# ---------- Decodificador PNG mínimo (IHDR + IDAT, sem interlace) ----------

def decode_png(path):
    """Retorna (width, height, color_type, bit_depth, rgba_rows) ou levanta ValueError."""
    with open(path, 'rb') as f:
        data = f.read()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('assinatura PNG inválida')
    pos, idat, ihdr = 8, b'', None
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + length]
        if ctype == b'IHDR':
            ihdr = chunk
        elif ctype == b'IDAT':
            idat += chunk
        elif ctype == b'IEND':
            break
        pos += 12 + length
    if ihdr is None:
        raise ValueError('IHDR ausente')
    w, h, bd, ct, comp, filt, inter = struct.unpack('>IIBBBBB', ihdr)
    if inter != 0:
        raise ValueError('PNG entrelaçado não suportado pelo validador')
    if ct not in (2, 6):
        raise ValueError(f'color type {ct} não suportado (esperado 2=RGB ou 6=RGBA)')
    if bd != 8:
        raise ValueError(f'bit depth {bd} não suportado (esperado 8)')
    bpp = 4 if ct == 6 else 3
    raw = zlib.decompress(idat)
    stride = w * bpp
    rows, prev = [], bytearray(stride)
    pos = 0
    for _ in range(h):
        ft = raw[pos]
        pos += 1
        line = bytearray(raw[pos:pos + stride])
        pos += stride
        if ft == 1:    # Sub
            for i in range(bpp, stride):
                line[i] = (line[i] + line[i - bpp]) & 0xFF
        elif ft == 2:  # Up
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ft == 3:  # Average
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif ft == 4:  # Paeth
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                b = prev[i]
                c = prev[i - bpp] if i >= bpp else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 0xFF
        rows.append(bytes(line))
        prev = line
    return w, h, ct, bd, rows, bpp


def sample_alpha(rows, bpp, w, h, coords):
    """alpha dos pixels nas coords [(x,y)…] — RGB conta como opaco (255)."""
    out = []
    for x, y in coords:
        if bpp == 4:
            out.append(rows[y][x * 4 + 3])
        else:
            out.append(255)
    return out


def validate(path, fname):
    fails = []
    kb = os.path.getsize(path) // 1024
    if kb > MAX_KB:
        fails.append(f'peso {kb}KB > {MAX_KB}KB')
    try:
        w, h, ct, bd, rows, bpp = decode_png(path)
    except ValueError as e:
        return [f'decodificação: {e}'], kb
    if (w, h) != (1024, 1024):
        fails.append(f'dimensão {w}x{h} (esperado 1024x1024)')
        return fails, kb
    if ct != 6:
        fails.append(f'color type {ct} = sem canal alpha (esperado RGBA)')
        return fails, kb

    # Bordas transparentes (amostra a cada 8 px nas 4 bordas)
    border = [(x, 0) for x in range(0, w, 8)] + \
             [(x, h - 1) for x in range(0, w, 8)] + \
             [(0, y) for y in range(0, h, 8)] + \
             [(w - 1, y) for y in range(0, h, 8)]
    alphas = sample_alpha(rows, bpp, w, h, border)
    transparent = sum(1 for a in alphas if a == 0)
    pct = 100 * transparent / len(alphas)
    if pct < 95:
        fails.append(f'bordas só {pct:.0f}% transparentes (fundo não-alpha ou personagem cortado)')

    # Checker nos cantos: pixels opacos brancos E cinzas ~#CCC juntos
    corner = [(x, y) for x in range(0, 32, 4) for y in range(0, 32, 4)]
    has_white = has_gray = False
    for x, y in corner:
        a = rows[y][x * 4 + 3]
        if a < 200:
            continue
        r, g, b = rows[y][x * 4], rows[y][x * 4 + 1], rows[y][x * 4 + 2]
        if r > 235 and g > 235 and b > 235:
            has_white = True
        if abs(r - g) <= 5 and abs(g - b) <= 5 and 190 <= r <= 220:
            has_gray = True
    if has_white and has_gray:
        fails.append('padrão checkerboard opaco detectado no canto')

    # Conteúdo presente no miolo (amostra grade 32x32 no centro 60%)
    x0, x1 = int(w * 0.2), int(w * 0.8)
    y0, y1 = int(h * 0.2), int(h * 0.8)
    grid = [(x, y) for x in range(x0, x1, (x1 - x0) // 32)
            for y in range(y0, y1, (y1 - y0) // 32)]
    opaque = sum(1 for x, y in grid if rows[y][x * 4 + 3] > 128)
    if 100 * opaque / len(grid) < 3:
        fails.append('miolo quase vazio (<3% opaco) — personagem ausente ou minúsculo')

    # Ancoragem: conteúdo opaco na faixa 88–97% da altura
    band = [(x, y) for y in range(int(h * 0.88), int(h * 0.97), 4)
            for x in range(int(w * 0.2), int(w * 0.8), 16)]
    feet = sum(1 for x, y in band if rows[y][x * 4 + 3] > 128)
    if feet == 0:
        fails.append('nenhum conteúdo na faixa 88-97% da altura (pés não ancorados na base)')

    return fails, kb


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = expected_files()
    if only:
        files = [f for f in files if f.startswith(only)]
        if not files:
            print(f'Nenhum arquivo esperado com prefixo "{only}"')
            return 1

    missing, passed, failed = [], [], []
    for fname in files:
        path = os.path.join(BREEDS_DIR, fname)
        if not os.path.exists(path):
            missing.append(fname)
            continue
        fails, kb = validate(path, fname)
        if fails:
            failed.append((fname, fails))
        else:
            passed.append((fname, kb))

    print('=' * 64)
    print('QA TÉCNICO — ASSETS FINAIS DOS CÃES')
    print('=' * 64)
    print(f'Esperados : {len(files)}')
    print(f'Aprovados : {len(passed)}')
    print(f'Reprovados: {len(failed)}')
    print(f'Ausentes  : {len(missing)}')
    if failed:
        print('\n--- REPROVADOS ---')
        for fname, fails in failed:
            print(f'  ✗ {fname}')
            for f in fails:
                print(f'      - {f}')
    if missing:
        print('\n--- AUSENTES ---')
        for fname in missing:
            print(f'  ? {fname}')
    if passed:
        print('\n--- APROVADOS ---')
        for fname, kb in passed:
            print(f'  ✓ {fname} ({kb}KB)')
    go = len(passed) == len(files)
    print('\n' + ('GO: todos os assets aprovados — pronto para FINAL_PNG_BREEDS'
                  if go else 'NO-GO: pendências acima impedem a ativação'))
    return 0 if go else 1


if __name__ == '__main__':
    sys.exit(main())
