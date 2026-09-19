"""Add the Latin-1 glyphs Spanish needs to the Polymath Demo cuts.

The demo subset ships 66 glyphs and no diacritics at all, so each accented
letter here is composed from the font's own base letterform plus an accent
drawn to match that cut's stem weight. Punctuation the subset also lacks
(hyphen, dashes, bullet) is drawn from scratch.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Identity

# base letter -> accent, for both cases
ACCENTED = {
    0x00C1: ("A", "acute"), 0x00C9: ("E", "acute"), 0x00CD: ("I", "acute"),
    0x00D3: ("O", "acute"), 0x00DA: ("U", "acute"), 0x00DC: ("U", "dieresis"),
    0x00D1: ("N", "tilde"),
    0x00E1: ("a", "acute"), 0x00E9: ("e", "acute"), 0x00ED: ("dotlessi", "acute"),
    0x00F3: ("o", "acute"), 0x00FA: ("u", "acute"), 0x00FC: ("u", "dieresis"),
    0x00F1: ("n", "tilde"),
}
# codepoint -> (name, builder, advance factor of em)
PUNCT = {
    0x002D: ("hyphen", "dash", 0.38),
    0x2013: ("endash", "dash", 0.55),
    0x2014: ("emdash", "dash", 0.95),
    0x2022: ("bullet", "bullet", 0.42),
}


def contours(glyphset, name):
    """Record a glyph as a list of contours (each a list of pen calls)."""
    rec = RecordingPen()
    glyphset[name].draw(rec)
    out, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ("closePath", "endPath"):
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def contour_bounds(contour):
    ys = [p[1] for op, args in contour for p in args if isinstance(p, tuple)]
    xs = [p[0] for op, args in contour for p in args if isinstance(p, tuple)]
    return (min(xs), min(ys), max(xs), max(ys)) if xs else None


def replay(contour_list, pen):
    for contour in contour_list:
        for op, args in contour:
            getattr(pen, op)(*args)


def acute(pen, cx, y0, stem, upm):
    t, h = stem * 0.78, upm * 0.135
    dx = t * 0.85
    x = cx - (t + dx) / 2
    pen.moveTo((x, y0))
    pen.lineTo((x + t, y0))
    pen.lineTo((x + t + dx, y0 + h))
    pen.lineTo((x + dx, y0 + h))
    pen.closePath()


def dieresis(pen, cx, y0, stem, upm):
    r = stem * 0.42
    h = upm * 0.125
    gap = r * 2.5
    for sx in (cx - gap, cx + gap):
        # a rounded dot, four quarter-curves
        k = r * 0.5523
        cy = y0 + h / 2
        pen.moveTo((sx, cy - r))
        pen.curveTo((sx + k, cy - r), (sx + r, cy - k), (sx + r, cy))
        pen.curveTo((sx + r, cy + k), (sx + k, cy + r), (sx, cy + r))
        pen.curveTo((sx - k, cy + r), (sx - r, cy + k), (sx - r, cy))
        pen.curveTo((sx - r, cy - k), (sx - k, cy - r), (sx, cy - r))
        pen.closePath()


def tilde(pen, cx, y0, stem, upm):
    w = upm * 0.40
    t = stem * 0.62
    a = upm * 0.055           # wave amplitude
    x0, x1 = cx - w / 2, cx + w / 2
    mid = (x0 + x1) / 2
    yb = y0 + a
    # lower edge left->right, then upper edge back
    pen.moveTo((x0, yb))
    pen.curveTo((x0 + w * 0.18, yb + a * 1.5), (mid - w * 0.12, yb + a), (mid, yb))
    pen.curveTo((mid + w * 0.12, yb - a), (x1 - w * 0.18, yb - a * 1.5), (x1, yb))
    pen.lineTo((x1, yb + t))
    pen.curveTo((x1 - w * 0.18, yb + t - a * 1.5), (mid + w * 0.12, yb + t - a), (mid, yb + t))
    pen.curveTo((mid - w * 0.12, yb + t + a), (x0 + w * 0.18, yb + t + a * 1.5), (x0, yb + t))
    pen.closePath()


def dash(pen, width, stem, upm):
    t = stem * 0.72
    y = upm * 0.30
    inset = width * 0.10
    pen.moveTo((inset, y))
    pen.lineTo((width - inset, y))
    pen.lineTo((width - inset, y + t))
    pen.lineTo((inset, y + t))
    pen.closePath()


def bullet(pen, width, stem, upm):
    r = stem * 0.62
    cx, cy = width / 2, upm * 0.32 + r
    k = r * 0.5523
    pen.moveTo((cx, cy - r))
    pen.curveTo((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))
    pen.curveTo((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))
    pen.curveTo((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))
    pen.curveTo((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))
    pen.closePath()


ACCENTS = {"acute": acute, "dieresis": dieresis, "tilde": tilde}


def patch(src, dst):
    f = TTFont(src)
    upm = f["head"].unitsPerEm
    cap = f["OS/2"].sCapHeight
    xh = f["OS/2"].sxHeight
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()

    bp = BoundsPen(gs)
    gs[cmap[ord("I")]].draw(bp)
    stem = bp.bounds[2] - bp.bounds[0]

    cff = f["CFF "].cff
    top = cff[cff.fontNames[0]]
    cs_dict = top.CharStrings
    private = top.Private
    added = []

    # dotless i: the 'i' contours with the dot dropped
    i_contours = contours(gs, cmap[ord("i")])
    body = [c for c in i_contours if contour_bounds(c)[1] < xh]
    rec_dotless = body
    dotless_width = gs[cmap[ord("i")]].width

    def add_glyph(name, width, draw_fn):
        pen = T2CharStringPen(width, gs)
        draw_fn(pen)
        cs = pen.getCharString(private)
        # CharStrings.__setitem__ only replaces existing glyphs, so append
        # into the underlying index and register the name ourselves.
        if cs_dict.charStringsAreIndexed:
            cs_dict.charStringsIndex.append(cs)
            cs_dict.charStrings[name] = len(cs_dict.charStringsIndex) - 1
        else:
            cs_dict.charStrings[name] = cs
        if name not in top.charset:
            top.charset.append(name)
        f["hmtx"].metrics[name] = (int(width), 0)
        added.append(name)

    add_glyph("dotlessi", dotless_width, lambda p: replay(rec_dotless, p))

    for cp, (base, accent) in ACCENTED.items():
        bname = "dotlessi" if base == "dotlessi" else cmap[ord(base)]
        if bname == "dotlessi":
            base_contours = rec_dotless
            width = dotless_width
            bb = contour_bounds(rec_dotless[0])
            bxmin, bxmax, bymax = bb[0], bb[2], bb[3]
        else:
            base_contours = contours(gs, bname)
            width = gs[bname].width
            bp2 = BoundsPen(gs)
            gs[bname].draw(bp2)
            bxmin, bymin, bxmax, bymax = bp2.bounds
        cx = (bxmin + bxmax) / 2
        # sit the accent just above the base letter
        y0 = bymax + upm * (0.045 if bymax > cap * 0.9 else 0.055)
        gname = f"uni{cp:04X}"

        def draw(p, bc=base_contours, cx=cx, y0=y0, accent=accent):
            replay(bc, p)
            ACCENTS[accent](p, cx, y0, stem, upm)

        add_glyph(gname, width, draw)
        for t in f["cmap"].tables:
            t.cmap[cp] = gname

    for cp, (gname, kind, wf) in PUNCT.items():
        width = upm * wf
        fn = dash if kind == "dash" else bullet

        def draw(p, width=width, fn=fn):
            fn(p, width, stem, upm)

        add_glyph(gname, width, draw)
        for t in f["cmap"].tables:
            t.cmap[cp] = gname

    # registering the charstrings already put the new names in the CFF charset,
    # so dedupe rather than blindly appending (maxp would otherwise overcount)
    order = list(dict.fromkeys(f.getGlyphOrder() + added))
    f.setGlyphOrder(order)
    f["maxp"].numGlyphs = len(order)
    f.save(dst)
    return added


if __name__ == "__main__":
    a = patch(sys.argv[1], sys.argv[2])
    print(f"{sys.argv[2]}: +{len(a)} glyphs")
