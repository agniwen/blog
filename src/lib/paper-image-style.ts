import type { CSSProperties } from 'react';

type PaperImageStyle = CSSProperties & { '--paper-image-mask': string };

export function paperImageStyle(identity: string): PaperImageStyle {
  let seed = 2166136261;
  for (let index = 0; index < identity.length; index++) {
    seed = Math.imul(seed ^ identity.charCodeAt(index), 16777619) >>> 0;
  }

  // Filter only an opaque mask: the photograph itself is never displaced.
  // Without a viewBox, the grain stays in CSS pixels at every image size.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="paper" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feMorphology in="SourceGraphic" operator="erode" radius=".6" result="inset"/><feTurbulence type="fractalNoise" baseFrequency=".065 .1" numOctaves="2" seed="${seed % 2147483647}" result="grain"/><feDisplacementMap in="inset" in2="grain" scale="3.5" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".2"/></filter><rect width="100%" height="100%" fill="white" filter="url(#paper)"/></svg>`;

  return { '--paper-image-mask': `url("data:image/svg+xml,${encodeURIComponent(svg)}")` };
}
