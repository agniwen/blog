import { useEffect, useRef, useState } from 'react';

import { paperImageStyle } from '~/lib/paper-image-style';
import { cn } from '~/lib/utils';

const BLOOM_SECONDS = 0.62;
/** cubic-bezier(0.05, 0.7, 0.3, 1)：一开始快，贴到纸边再慢下来。 */
const BLOOM_CURVE = [0.05, 0.7, 0.3, 1] as const;

function cubicBezier(t: number, p1: number, p2: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}

function bloomProgress(progress: number): number {
  const [x1, y1, x2, y2] = BLOOM_CURVE;
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  let t = progress;
  for (let step = 0; step < 8; step += 1) {
    const x = cubicBezier(t, x1, x2) - progress;
    const c = 3 * x1;
    const b = 3 * (x2 - x1) - c;
    const a = 1 - c - b;
    const slope = (3 * a * t + 2 * b) * t + c;
    if (Math.abs(slope) < 1e-6) break;
    t = Math.min(1, Math.max(0, t - x / slope));
  }
  return cubicBezier(t, y1, y2);
}

function hash(x: number, y: number): number {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function fade(value: number): number {
  return value * value * (3 - 2 * value);
}

function valueNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = fade(x - x0);
  const ty = fade(y - y0);
  const v00 = hash(x0, y0);
  const v10 = hash(x0 + 1, y0);
  const v01 = hash(x0, y0 + 1);
  const v11 = hash(x0 + 1, y0 + 1);
  return v00 + (v10 - v00) * tx + (v01 - v00 + (v00 - v10 - v01 + v11) * tx) * ty;
}

function edgeWobble(angle: number): number {
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  const broad = valueNoise(x * 1.3 + 2, y * 1.3 + 5) - 0.5;
  const fine = valueNoise(x * 3.4 + 8, y * 3.4 + 1) - 0.5;
  return broad * 0.16 + fine * 0.07;
}

function makeLayer(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function fieldSize(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(0.5, 480 / Math.max(width, height));
  return {
    width: Math.max(2, Math.round(width * scale)),
    height: Math.max(2, Math.round(height * scale)),
  };
}

type WetField = {
  start: Float32Array;
  scale: Float32Array;
};

function prepareWetField(width: number, height: number): WetField {
  const count = width * height;
  const start = new Float32Array(count);
  const scale = new Float32Array(count);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const rx = width / 2;
  const ry = height / 2;
  const feather = 0.32;
  for (let y = 0; y < height; y += 1) {
    const ny = (y - cy) / ry;
    for (let x = 0; x < width; x += 1) {
      const nx = (x - cx) / rx;
      const dist = Math.hypot(nx, ny);
      const wobble = 1 + edgeWobble(Math.atan2(ny, nx));
      const index = y * width + x;
      start[index] = dist / wobble;
      scale[index] = wobble / feather;
    }
  }
  return { start, scale };
}

function whiteMask(width: number, height: number): ImageData {
  const pixels = new ImageData(width, height);
  const data = pixels.data;
  for (let index = 0; index < data.length; index += 4) {
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
  }
  return pixels;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
): void {
  const scale = Math.max(width / image.width, height / image.height);
  const drawnWidth = image.width * scale;
  const drawnHeight = image.height * scale;
  ctx.drawImage(
    image,
    (width - drawnWidth) / 2,
    (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight,
  );
}

function fillWetField(
  field: HTMLCanvasElement,
  wet: WetField,
  reach: number,
  pixels: ImageData,
): void {
  const ctx = field.getContext('2d');
  if (!ctx) return;
  const { start, scale } = wet;
  const data = pixels.data;
  for (let index = 0; index < start.length; index += 1) {
    const t = (reach - start[index]) * scale[index];
    const alpha = fade(t <= 0 ? 0 : t >= 1 ? 1 : t);
    data[index * 4 + 3] = (alpha * 255) | 0;
  }
  ctx.putImageData(pixels, 0, 0);
}

/**
 * 文章封面：先是纸色，照片从中心带着毛边晕开。分享图仍用完整的 banner 地址。
 * `prefers-reduced-motion` 时直接画完整照片。
 */
export function BannerBloom({ src, alt, seed }: { src: string; alt: string; seed: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seenSrc, setSeenSrc] = useState(src);
  const [settled, setSettled] = useState(false);
  const [shadowReady, setShadowReady] = useState(true);
  if (src !== seenSrc) {
    setSeenSrc(src);
    setSettled(false);
    setShadowReady(false);
  }

  useEffect(() => {
    if (shadowReady) return;
    const frame = requestAnimationFrame(() => setShadowReady(true));
    return () => cancelAnimationFrame(frame);
  }, [shadowReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    let frame = 0;
    let stopped = false;
    let done = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const image = new Image();
    image.decoding = 'async';
    image.src = src;

    const drawFinished = () => {
      if (stopped || image.naturalWidth === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx || canvas.clientWidth === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const paper = getComputedStyle(parent).backgroundColor;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, width, height);
      drawCover(ctx, image, width, height);
      done = true;
      setSettled(true);
    };

    const play = () => {
      if (stopped || image.naturalWidth === 0 || canvas.clientWidth === 0) return;
      if (reduced) {
        drawFinished();
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const paper = getComputedStyle(parent).backgroundColor;
      const source = makeLayer(width, height);
      const sourceCtx = source.getContext('2d');
      const maskSize = fieldSize(width, height);
      const field = makeLayer(maskSize.width, maskSize.height);
      const scratch = makeLayer(width, height);
      const scratchCtx = scratch.getContext('2d');
      if (!sourceCtx || !scratchCtx) return;
      sourceCtx.fillStyle = paper;
      sourceCtx.fillRect(0, 0, width, height);
      drawCover(sourceCtx, image, width, height);
      const wet = prepareWetField(maskSize.width, maskSize.height);
      const pixels = whiteMask(maskSize.width, maskSize.height);
      const started = performance.now();

      const draw = (now: number) => {
        if (stopped) return;
        const time = (now - started) / 1000;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, width, height);
        if (time >= BLOOM_SECONDS) {
          ctx.drawImage(source, 0, 0);
          done = true;
          setSettled(true);
          return;
        }
        const eased = bloomProgress(time / BLOOM_SECONDS);
        fillWetField(field, wet, 0.12 + eased * 1.96, pixels);
        scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
        scratchCtx.globalAlpha = 1;
        scratchCtx.globalCompositeOperation = 'source-over';
        scratchCtx.clearRect(0, 0, width, height);
        scratchCtx.drawImage(source, 0, 0);
        scratchCtx.globalCompositeOperation = 'destination-in';
        scratchCtx.imageSmoothingEnabled = true;
        scratchCtx.drawImage(field, 0, 0, width, height);
        scratchCtx.globalCompositeOperation = 'source-over';
        ctx.drawImage(scratch, 0, 0);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };

    let started = false;
    const begin = () => {
      if (started || stopped || image.naturalWidth === 0 || canvas.clientWidth === 0) return;
      started = true;
      play();
    };

    if (image.complete) begin();
    else image.addEventListener('load', begin, { once: true });

    const observer = new ResizeObserver(() => {
      if (!started) begin();
      else if (done) drawFinished();
    });
    observer.observe(canvas);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      image.removeEventListener('load', begin);
      observer.disconnect();
    };
  }, [src]);

  return (
    <div className='pointer-events-none relative mb-8 aspect-16/10 bg-background *:select-none'>
      <canvas
        ref={canvasRef}
        className='paper-image absolute inset-0 z-2 h-full w-full'
        style={paperImageStyle(seed)}
        role='img'
        aria-label={alt}
      />
      <img
        className={cn(
          'pointer-events-none absolute top-10 left-0 z-1 aspect-16/10 rounded-xs object-cover opacity-0 blur-3xl',
          shadowReady && 'transition-opacity duration-700 ease-out motion-reduce:transition-none',
          settled && 'opacity-30',
        )}
        src={src}
        alt=''
      />
    </div>
  );
}
