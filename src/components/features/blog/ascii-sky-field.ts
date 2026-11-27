export const CELL_W = 9;
export const CELL_H = 11;

const SKY_GLYPHS = [' ', '·', '.', ':', '-'] as const;
const CLOUD_CORE_GLYPHS = [' ', '·', '.'] as const;
const CLOUD_EDGE_GLYPHS = [':', '-', '=', '+', '*'] as const;

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface SkyPalette {
  skyTop: Rgb;
  skyMid: Rgb;
  skyBottom: Rgb;
  cloudHighlight: Rgb;
  cloudShadow: Rgb;
  wakeTint: Rgb;
  skyInkRgb: string;
  cloudInkRgb: string;
  wakeInkRgb: string;
  skyInkAlphaMin: number;
  skyInkAlphaMax: number;
  cloudInkAlphaMin: number;
  cloudInkAlphaMax: number;
}

export const LIGHT_PALETTE: SkyPalette = {
  skyTop: { r: 126, g: 178, b: 220 },
  skyMid: { r: 174, g: 209, b: 235 },
  skyBottom: { r: 223, g: 234, b: 242 },
  cloudHighlight: { r: 254, g: 254, b: 251 },
  cloudShadow: { r: 201, g: 220, b: 234 },
  wakeTint: { r: 74, g: 137, b: 199 },
  skyInkRgb: '40, 107, 189',
  cloudInkRgb: '82, 114, 145',
  wakeInkRgb: '33, 91, 165',
  skyInkAlphaMin: 0.22,
  skyInkAlphaMax: 0.4,
  cloudInkAlphaMin: 0.18,
  cloudInkAlphaMax: 0.42,
};

export const DARK_PALETTE: SkyPalette = {
  skyTop: { r: 29, g: 45, b: 63 },
  skyMid: { r: 35, g: 51, b: 68 },
  skyBottom: { r: 38, g: 43, b: 48 },
  cloudHighlight: { r: 68, g: 93, b: 120 },
  cloudShadow: { r: 43, g: 61, b: 80 },
  wakeTint: { r: 108, g: 160, b: 224 },
  skyInkRgb: '176, 210, 245',
  cloudInkRgb: '176, 210, 245',
  wakeInkRgb: '205, 228, 252',
  skyInkAlphaMin: 0.24,
  skyInkAlphaMax: 0.46,
  cloudInkAlphaMin: 0.24,
  cloudInkAlphaMax: 0.46,
};

export interface StillCell {
  bg: Rgb;
  glyph: string;
  ink: string;
}

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const k = clamp01(t);
  return {
    r: Math.round(lerp(a.r, b.r, k)),
    g: Math.round(lerp(a.g, b.g, k)),
    b: Math.round(lerp(a.b, b.b, k)),
  };
}

function hash2D(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2D(ix, iy);
  const b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1);
  const d = hash2D(ix + 1, iy + 1);

  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
}

function fbm(x: number, y: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    freq *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

export function sampleCloudDensity(nx: number, ny: number, drift: number): number {
  const sx = nx * 3.1 - drift;
  const sy = ny * 2.2;
  const warpX = fbm(sx * 0.65 + 4.2, sy * 0.65 + 1.7) * 0.55;
  const warpY = fbm(sx * 0.65 + 9.1, sy * 0.65 + 5.3) * 0.4;
  const base = fbm(sx + warpX, sy + warpY);

  const altitudeEnvelope = 1 - smoothstep(0.62, 1.0, ny) * 0.45;
  return smoothstep(0.46, 0.78, base * altitudeEnvelope);
}

function skyBase(ny: number, palette: SkyPalette): Rgb {
  return ny < 0.5
    ? mixRgb(palette.skyTop, palette.skyMid, ny * 2)
    : mixRgb(palette.skyMid, palette.skyBottom, (ny - 0.5) * 2);
}

/** First-frame cell color and glyph. `drift` is 0 until the canvas starts animating. */
export function sampleStillCell(nx: number, ny: number, palette: SkyPalette, drift = 0): StillCell {
  const density = sampleCloudDensity(nx, ny, drift);
  const upperDensity = sampleCloudDensity(nx, Math.max(0, ny - 0.14), drift);
  const shade = clamp01(0.5 + (upperDensity - density) * 1.35);
  const bg = mixRgb(
    skyBase(ny, palette),
    mixRgb(palette.cloudHighlight, palette.cloudShadow, shade),
    density,
  );

  if (density > 0.16) {
    const detail = valueNoise(nx * 18 - drift * 1.4, ny * 14);
    let glyph: string;
    if (density > 0.65 && shade < 0.45) {
      const gIdx = Math.min(
        CLOUD_CORE_GLYPHS.length - 1,
        Math.floor(detail * CLOUD_CORE_GLYPHS.length),
      );
      glyph = CLOUD_CORE_GLYPHS[gIdx] ?? ' ';
    } else {
      const edgeFactor = clamp01((1 - density) * 0.55 + shade * 0.55 + detail * 0.25);
      const gIdx = Math.min(
        CLOUD_EDGE_GLYPHS.length - 1,
        Math.floor(edgeFactor * CLOUD_EDGE_GLYPHS.length),
      );
      glyph = CLOUD_EDGE_GLYPHS[gIdx] ?? ':';
    }
    const alpha = lerp(
      palette.cloudInkAlphaMin,
      palette.cloudInkAlphaMax,
      clamp01(shade * 0.7 + (1 - density) * 0.3),
    );
    return { bg, glyph, ink: `rgba(${palette.cloudInkRgb}, ${alpha.toFixed(2)})` };
  }

  const skyDetail = valueNoise(nx * 16 + drift * 0.6, ny * 12);
  const gIdx = Math.min(
    SKY_GLYPHS.length - 1,
    Math.floor(clamp01(skyDetail * 0.85 + (1 - ny) * 0.2) * SKY_GLYPHS.length),
  );
  const glyph = SKY_GLYPHS[gIdx] ?? ' ';
  const alpha = lerp(palette.skyInkAlphaMin, palette.skyInkAlphaMax, skyDetail);
  return { bg, glyph, ink: `rgba(${palette.skyInkRgb}, ${alpha.toFixed(2)})` };
}
