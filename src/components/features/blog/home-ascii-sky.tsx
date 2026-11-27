'use client';

import { useEffect, useRef } from 'react';

import {
  CELL_H,
  CELL_W,
  clamp01,
  DARK_PALETTE,
  LIGHT_PALETTE,
  mixRgb,
  sampleStillCell,
} from '~/components/features/blog/ascii-sky-field';

const IDLE_FRAME_MS = 1000 / 24;
const ACTIVE_FRAME_MS = 1000 / 50;
const WAKE_RADIUS = 2.5;
const WAKE_DECAY_MS = 900;

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
        const cellY = row * CELL_H;
        const textY = cellY + CELL_H * 0.54;

        for (let col = 0; col < cols; col++) {
          const nx = (col + 0.5) * invCols;
          const idx = row * cols + col;
          const still = sampleStillCell(nx, ny, palette, drift);
          let bg = still.bg;
          let glyph = still.glyph;
          let inkStyle = still.ink;

          const wake = wakeStrength[idx];
          if (wake > 0) {
            bg = mixRgb(bg, palette.wakeTint, wake * 0.52);
          }

          const cellX = col * CELL_W;
          ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
          ctx.fillRect(cellX + 0.5, cellY + 0.5, CELL_W - 1, CELL_H - 1);

          if (wake > 0.12) {
            glyph = pickWakeGlyph(wakeAngle[idx] ?? 0, wake);
            const alpha = clamp01(0.28 + wake * 0.45);
            inkStyle = `rgba(${palette.wakeInkRgb}, ${alpha.toFixed(2)})`;
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
      const angle = prevPointer ? Math.atan2(localY - prevPointer.y, localX - prevPointer.x) : 0;
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
