'use client';

import { useEffect, useRef } from 'react';

const CELL_W = 9;
const CELL_H = 11;
const IDLE_FRAME_MS = 1000 / 24;
const ACTIVE_FRAME_MS = 1000 / 50;
const WAKE_RADIUS = 2.5;
const WAKE_DECAY_MS = 900;

const SKY_GLYPHS = [' ', '·', '.', ':', '-'] as const;
const CLOUD_CORE_GLYPHS = [' ', '·', '.'] as const;
const CLOUD_EDGE_GLYPHS = [':', '-', '=', '+', '*'] as const;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface SkyPalette {
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

const LIGHT_PALETTE: SkyPalette = {
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

const DARK_PALETTE: SkyPalette = {
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

function clamp01(value: number): number {
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

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
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

function sampleCloudDensity(nx: number, ny: number, drift: number): number {
  const sx = nx * 3.1 - drift;
  const sy = ny * 2.2;
  const warpX = fbm(sx * 0.65 + 4.2, sy * 0.65 + 1.7) * 0.55;
  const warpY = fbm(sx * 0.65 + 9.1, sy * 0.65 + 5.3) * 0.4;
  const base = fbm(sx + warpX, sy + warpY);

  // Taper cloud density near the very bottom so the sky dissolves cleanly.
  const altitudeEnvelope = 1 - smoothstep(0.62, 1.0, ny) * 0.45;
  return smoothstep(0.46, 0.78, base * altitudeEnvelope);
}

function pickWakeGlyph(angle: number, strength: number): string {
  if (strength < 0.22) return ':';
  const norm = ((angle % Math.PI) + Math.PI) % Math.PI;
  if (norm < Math.PI * 0.2 || norm > Math.PI * 0.8) return '-';
  if (norm < Math.PI * 0.45) return '\\';
  if (norm < Math.PI * 0.62) return '~';
  return '/';
}

/**
 * Procedural ASCII cloud sky canvas rendered at the top of the blog homepage.
 * Respects dark mode, reduced-motion preferences, and background tab visibility.
 */
export function HomeAsciiSky() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let wakeStrength = new Float32Array(0);
    let wakeAngle = new Float32Array(0);
    let hasActiveWake = false;

    let isDark = document.documentElement.classList.contains('dark');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;
    let isVisible = document.visibilityState !== 'hidden';

    let rafId: number | null = null;
    let lastDrawTime = 0;
    let simTime = 0;
    let lastTickTime = performance.now();
    let prevPointer: { x: number; y: number } | null = null;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const nextCols = Math.ceil(width / CELL_W);
      const nextRows = Math.ceil(height / CELL_H);
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        wakeStrength = new Float32Array(cols * rows);
        wakeAngle = new Float32Array(cols * rows);
        hasActiveWake = false;
      }
    };

    const drawFrame = (dtMs: number) => {
      if (cols === 0 || rows === 0) return;

      const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
      const drift = simTime * 0.018;

      if (hasActiveWake) {
        const decay = dtMs / WAKE_DECAY_MS;
        let stillActive = false;
        for (let i = 0; i < wakeStrength.length; i++) {
          if (wakeStrength[i] > 0) {
            const next = wakeStrength[i] - decay;
            if (next > 0.01) {
              wakeStrength[i] = next;
              stillActive = true;
            } else {
              wakeStrength[i] = 0;
            }
          }
        }
        hasActiveWake = stillActive;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const invCols = 1 / Math.max(1, cols);
      const invRows = 1 / Math.max(1, rows);

      for (let row = 0; row < rows; row++) {
        const ny = (row + 0.5) * invRows;
        const skyBase =
          ny < 0.5
            ? mixRgb(palette.skyTop, palette.skyMid, ny * 2)
            : mixRgb(palette.skyMid, palette.skyBottom, (ny - 0.5) * 2);

        const cellY = row * CELL_H;
        const textY = cellY + CELL_H * 0.54;

        for (let col = 0; col < cols; col++) {
          const nx = (col + 0.5) * invCols;
          const idx = row * cols + col;

          const density = sampleCloudDensity(nx, ny, drift);
          const upperDensity = sampleCloudDensity(nx, Math.max(0, ny - 0.14), drift);
          const shade = clamp01(0.5 + (upperDensity - density) * 1.35);

          const cloudColor = mixRgb(palette.cloudHighlight, palette.cloudShadow, shade);
          let bg = mixRgb(skyBase, cloudColor, density);

          const wake = wakeStrength[idx];
          if (wake > 0) {
            bg = mixRgb(bg, palette.wakeTint, wake * 0.52);
          }

          const cellX = col * CELL_W;
          ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
          ctx.fillRect(cellX + 0.5, cellY + 0.5, CELL_W - 1, CELL_H - 1);

          let glyph = ' ';
          let inkStyle = '';

          if (wake > 0.12) {
            glyph = pickWakeGlyph(wakeAngle[idx], wake);
            const alpha = clamp01(0.28 + wake * 0.45);
            inkStyle = `rgba(${palette.wakeInkRgb}, ${alpha.toFixed(2)})`;
          } else if (density > 0.16) {
            const detail = valueNoise(nx * 18 - drift * 1.4, ny * 14);
            if (density > 0.65 && shade < 0.45) {
              const gIdx = Math.min(
                CLOUD_CORE_GLYPHS.length - 1,
                Math.floor(detail * CLOUD_CORE_GLYPHS.length),
              );
              glyph = CLOUD_CORE_GLYPHS[gIdx];
            } else {
              const edgeFactor = clamp01((1 - density) * 0.55 + shade * 0.55 + detail * 0.25);
              const gIdx = Math.min(
                CLOUD_EDGE_GLYPHS.length - 1,
                Math.floor(edgeFactor * CLOUD_EDGE_GLYPHS.length),
              );
              glyph = CLOUD_EDGE_GLYPHS[gIdx];
            }
            const alpha = lerp(
              palette.cloudInkAlphaMin,
              palette.cloudInkAlphaMax,
              clamp01(shade * 0.7 + (1 - density) * 0.3),
            );
            inkStyle = `rgba(${palette.cloudInkRgb}, ${alpha.toFixed(2)})`;
          } else {
            const skyDetail = valueNoise(nx * 16 + drift * 0.6, ny * 12);
            const gIdx = Math.min(
              SKY_GLYPHS.length - 1,
              Math.floor(clamp01(skyDetail * 0.85 + (1 - ny) * 0.2) * SKY_GLYPHS.length),
            );
            glyph = SKY_GLYPHS[gIdx];
            const alpha = lerp(palette.skyInkAlphaMin, palette.skyInkAlphaMax, skyDetail);
            inkStyle = `rgba(${palette.skyInkRgb}, ${alpha.toFixed(2)})`;
          }

          if (glyph !== ' ') {
            ctx.fillStyle = inkStyle;
            ctx.fillText(glyph, cellX + CELL_W * 0.5, textY);
          }
        }
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const tick = (now: number) => {
      rafId = null;
      if (!isVisible || prefersReducedMotion) return;

      const targetMs = hasActiveWake ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;
      const elapsedSinceDraw = now - lastDrawTime;
      if (elapsedSinceDraw >= targetMs) {
        const dtMs = Math.min(100, now - lastTickTime);
        simTime += dtMs * 0.001;
        lastTickTime = now;
        lastDrawTime = now;
        drawFrame(dtMs);
      }

      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion || !isVisible || rafId !== null) return;
      lastTickTime = performance.now();
      lastDrawTime = 0;
      rafId = requestAnimationFrame(tick);
    };

    const stampWake = (clientX: number, clientY: number) => {
      if (prefersReducedMotion || cols === 0 || rows === 0) return;

      const rect = container.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        prevPointer = null;
        return;
      }

      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const angle = prevPointer
        ? Math.atan2(localY - prevPointer.y, localX - prevPointer.x)
        : 0;
      prevPointer = { x: localX, y: localY };

      const centerCol = localX / CELL_W;
      const centerRow = localY / CELL_H;
      const rCeil = Math.ceil(WAKE_RADIUS);

      const minCol = Math.max(0, Math.floor(centerCol - rCeil));
      const maxCol = Math.min(cols - 1, Math.ceil(centerCol + rCeil));
      const minRow = Math.max(0, Math.floor(centerRow - rCeil));
      const maxRow = Math.min(rows - 1, Math.ceil(centerRow + rCeil));

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const dx = col + 0.5 - centerCol;
          const dy = row + 0.5 - centerRow;
          const dist = Math.hypot(dx, dy);
          if (dist <= WAKE_RADIUS) {
            const strength = 1 - dist / WAKE_RADIUS;
            const idx = row * cols + col;
            if (strength > wakeStrength[idx]) {
              wakeStrength[idx] = strength;
              wakeAngle[idx] = angle;
            }
            hasActiveWake = true;
          }
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      stampWake(event.clientX, event.clientY);
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden';
      if (isVisible) {
        if (prefersReducedMotion) {
          drawFrame(0);
        } else {
          startLoop();
        }
      } else {
        stopLoop();
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        stopLoop();
        wakeStrength.fill(0);
        hasActiveWake = false;
        drawFrame(0);
      } else {
        startLoop();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      drawFrame(0);
    });
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      const nextDark = document.documentElement.classList.contains('dark');
      if (nextDark !== isDark) {
        isDark = nextDark;
        drawFrame(0);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    resize();
    drawFrame(0);
    container.dataset.ready = 'true';
    if (!prefersReducedMotion && isVisible) {
      startLoop();
    }

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden='true'
      className='group pointer-events-none absolute inset-x-0 top-0 z-0 h-[280px] overflow-hidden select-none sm:h-[350px]'
      style={{
        maskImage:
          'linear-gradient(to bottom, black 0%, black 38%, rgb(0 0 0 / 0.55) 68%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 38%, rgb(0 0 0 / 0.55) 68%, transparent 100%)',
      }}
    >
      <div className='home-ascii-sky-placeholder absolute inset-0 opacity-100 transition-opacity duration-300 ease-out group-data-[ready=true]:opacity-0 motion-reduce:transition-none' />
      <canvas
        ref={canvasRef}
        className='relative block size-full opacity-0 transition-opacity duration-300 ease-out group-data-[ready=true]:opacity-100 motion-reduce:transition-none'
      />
    </div>
  );
}
