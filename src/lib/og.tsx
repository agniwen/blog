import { ImageResponse } from '@cf-wasm/og';
import { PhotonImage, SamplingFilter, resize } from '@cf-wasm/photon';

import { clientEnv } from '~/lib/client-env';
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_TITLE,
} from '~/lib/site-meta';

const GOOGLE_FONT_UA =
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';
const BASE_FONT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,·-:/…'&()!? ";
const MAX_FONT_CACHE_ENTRIES = 32;
const MAX_BANNER_CACHE_ENTRIES = 16;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const FONT_WEIGHTS = [400, 500] as const;

const fontCache = new Map<string, ArrayBuffer>();
const bannerCache = new Map<string, CachedBanner>();
let cachedAvatarDataUri: string | null = null;
let cachedAvatarSourceUrl: string | null = null;

export interface OgPostData {
  id: string;
  title: string | null;
  description: string | null;
  summary: string | null;
  banner: string | null;
  createdAt: Date;
}

interface BannerPalette {
  bgRgb: [number, number, number];
  bgHex: string;
  isDark: boolean;
  titleColor: string;
  excerptColor: string;
  brandColor: string;
  metaColor: string;
  dotColor: string;
  avatarRing: string;
}

interface CachedBanner {
  dataUri: string;
  palette: BannerPalette;
}

const DEFAULT_LIGHT_PALETTE: BannerPalette = {
  bgRgb: [250, 249, 245],
  bgHex: '#faf9f5',
  isDark: false,
  titleColor: '#0b0d0b',
  excerptColor: '#595959',
  brandColor: '#2b2e2b',
  metaColor: '#7a7d78',
  dotColor: '#a3a6a1',
  avatarRing: 'rgba(24, 24, 27, 0.08)',
};

type FontEntry = {
  name: string;
  weight: 400 | 500;
  style: 'normal';
  data: ArrayBuffer;
};

const OG_CACHE_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
};

function rememberBounded<T>(cache: Map<string, T>, key: string, value: T, maxEntries: number) {
  if (cache.size >= maxEntries) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, value);
}

async function fetchNotoSansScWeight(
  weight: 400 | 500,
  uniqueChars: string,
): Promise<ArrayBuffer | null> {
  const cacheKey = `${weight}:${uniqueChars}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@${weight}&text=${encodeURIComponent(uniqueChars)}`;
    const cssRes = await fetch(cssUrl, {
      headers: { 'User-Agent': GOOGLE_FONT_UA },
      signal: AbortSignal.timeout(5000),
    });
    if (!cssRes.ok) return null;

    const css = await cssRes.text();
    const matchedUrl =
      css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:opentype|truetype)['"]\)/)?.[1] ??
      css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1];
    if (!matchedUrl) return null;

    const fontRes = await fetch(matchedUrl, { signal: AbortSignal.timeout(5000) });
    if (!fontRes.ok) return null;

    const data = await fontRes.arrayBuffer();
    if (data.byteLength === 0) return null;
    rememberBounded(fontCache, cacheKey, data, MAX_FONT_CACHE_ENTRIES);
    return data;
  } catch {
    return null;
  }
}

async function loadNotoSansScFonts(text: string): Promise<FontEntry[] | undefined> {
  const uniqueChars = [...new Set(`${BASE_FONT_CHARS}${text}`)].toSorted().join('');
  const loaded = await Promise.all(
    FONT_WEIGHTS.map(async (weight) => {
      const data = await fetchNotoSansScWeight(weight, uniqueChars);
      return data
        ? ({
            name: 'Noto Sans SC',
            weight,
            style: 'normal',
            data,
          } satisfies FontEntry)
        : null;
    }),
  );
  const fonts = loaded.filter((entry): entry is FontEntry => entry !== null);
  return fonts.length > 0 ? fonts : undefined;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return [h * 60, s, l];
}

function hueToChannel(p: number, q: number, t: number): number {
  let wrapped = t;
  if (wrapped < 0) wrapped += 1;
  if (wrapped > 1) wrapped -= 1;
  if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
  if (wrapped < 1 / 2) return q;
  if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const val = Math.round(l * 255);
    return [val, val, val];
  }
  const hNorm = (((h % 360) + 360) % 360) / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hueToChannel(p, q, hNorm + 1 / 3) * 255),
    Math.round(hueToChannel(p, q, hNorm) * 255),
    Math.round(hueToChannel(p, q, hNorm - 1 / 3) * 255),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractBannerPalette(image: PhotonImage): BannerPalette {
  const width = image.get_width();
  const height = image.get_height();
  const pixels = image.get_raw_pixels();
  if (width <= 0 || height <= 0 || pixels.length < width * height * 4) {
    return DEFAULT_LIGHT_PALETTE;
  }

  const targetAspect = 760 / 630;
  const imgAspect = width / height;
  const cropW = imgAspect > targetAspect ? Math.max(1, Math.round(height * targetAspect)) : width;
  const cropH = imgAspect > targetAspect ? height : Math.max(1, Math.round(width / targetAspect));
  const cropX = Math.floor((width - cropW) / 2);
  const cropY = Math.floor((height - cropH) / 2);

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let totalWeight = 0;
  const steps = 24;

  for (let iy = 0; iy < steps; iy++) {
    const v = 0.05 + (0.9 * iy) / (steps - 1);
    const py = Math.min(height - 1, cropY + Math.floor(v * (cropH - 1)));
    for (let ix = 0; ix < steps; ix++) {
      const u = 0.02 + (0.76 * ix) / (steps - 1);
      const px = Math.min(width - 1, cropX + Math.floor(u * (cropW - 1)));
      const offset = (py * width + px) * 4;
      const a = pixels[offset + 3] ?? 255;
      if (a < 128) continue;

      const weight = u <= 0.35 ? 2.2 : 1.0;
      sumR += (pixels[offset] ?? 0) * weight;
      sumG += (pixels[offset + 1] ?? 0) * weight;
      sumB += (pixels[offset + 2] ?? 0) * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight <= 0) return DEFAULT_LIGHT_PALETTE;

  const avgR = sumR / totalWeight;
  const avgG = sumG / totalWeight;
  const avgB = sumB / totalWeight;
  const luminance = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
  const [h, s, l] = rgbToHsl(avgR, avgG, avgB);
  const isDark = luminance < 0.5;

  const bgS = isDark ? Math.min(0.34, s * 0.75) : Math.min(0.28, s * 0.65);
  const bgL = isDark
    ? Math.min(0.19, Math.max(0.1, l * 0.55 + 0.05))
    : Math.min(0.96, Math.max(0.91, 0.9 + (l - 0.5) * 0.12));
  const bgRgb = hslToRgb(h, bgS, bgL);
  const fgRgb = isDark
    ? hslToRgb(h, Math.min(0.16, bgS * 0.5), 0.96)
    : hslToRgb(h, Math.min(0.28, bgS * 0.8), 0.09);
  const [fr, fg, fb] = fgRgb;

  return {
    bgRgb,
    bgHex: rgbToHex(bgRgb),
    isDark,
    titleColor: `rgb(${fr}, ${fg}, ${fb})`,
    brandColor: `rgba(${fr}, ${fg}, ${fb}, ${isDark ? 0.92 : 0.88})`,
    excerptColor: `rgba(${fr}, ${fg}, ${fb}, ${isDark ? 0.78 : 0.74})`,
    metaColor: `rgba(${fr}, ${fg}, ${fb}, ${isDark ? 0.58 : 0.54})`,
    dotColor: `rgba(${fr}, ${fg}, ${fb}, ${isDark ? 0.42 : 0.38})`,
    avatarRing: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
  };
}

function decodeBannerWithPalette(bytes: Uint8Array, maxWidth = 1000): CachedBanner | null {
  let input: PhotonImage | null = null;
  let resized: PhotonImage | null = null;
  try {
    input = PhotonImage.new_from_byteslice(bytes);
    const width = input.get_width();
    const height = input.get_height();
    if (width <= 0 || height <= 0) return null;

    let target = input;
    if (width > maxWidth) {
      const targetHeight = Math.max(1, Math.round((height * maxWidth) / width));
      resized = resize(input, maxWidth, targetHeight, SamplingFilter.Triangle);
      target = resized;
    }

    const palette = extractBannerPalette(target);
    const jpegBytes = target.get_bytes_jpeg(86);
    if (jpegBytes.byteLength === 0) return null;
    return {
      dataUri: `data:image/jpeg;base64,${uint8ArrayToBase64(jpegBytes)}`,
      palette,
    };
  } catch {
    return null;
  } finally {
    resized?.free();
    input?.free();
  }
}

function normalizeImageUrl(rawUrl: string, sizeHint?: number): string {
  try {
    const parsed = new URL(rawUrl);
    if (
      sizeHint &&
      parsed.hostname === 'avatars.githubusercontent.com' &&
      !parsed.searchParams.has('s') &&
      !parsed.searchParams.has('size')
    ) {
      parsed.searchParams.set('s', String(sizeHint));
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

async function fetchImageBytes(
  url: string | null | undefined,
  sizeHint?: number,
): Promise<{ mime: string; bytes: Uint8Array } | null> {
  if (!url) return null;
  const targetUrl = normalizeImageUrl(url.trim(), sizeHint);
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) return null;

  try {
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'image/png,image/jpeg,image/webp,image/gif,*/*;q=0.8' },
    });
    if (!response.ok) return null;

    const rawContentType = response.headers.get('content-type') ?? '';
    const mime = rawContentType.split(';')[0]?.trim().toLowerCase();
    if (!mime || !mime.startsWith('image/')) return null;

    const contentLength = Number(response.headers.get('content-length') ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) return null;

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_IMAGE_BYTES) return null;

    return { mime, bytes: new Uint8Array(buffer) };
  } catch {
    return null;
  }
}

async function getAvatarDataUri(): Promise<string | null> {
  const source = clientEnv.NEXT_PUBLIC_AVATAR_URL;
  if (cachedAvatarDataUri && cachedAvatarSourceUrl === source) {
    return cachedAvatarDataUri;
  }
  const fetched = await fetchImageBytes(source, 256);
  if (!fetched) return null;

  let dataUri: string | null = null;
  if (fetched.mime === 'image/webp') {
    dataUri = decodeBannerWithPalette(fetched.bytes, 256)?.dataUri ?? null;
  } else {
    dataUri = `data:${fetched.mime};base64,${uint8ArrayToBase64(fetched.bytes)}`;
  }

  if (dataUri) {
    cachedAvatarDataUri = dataUri;
    cachedAvatarSourceUrl = source;
  }
  return dataUri;
}

async function getBannerWithPalette(
  bannerUrl: string | null | undefined,
): Promise<CachedBanner | null> {
  const key = bannerUrl?.trim();
  if (!key) return null;

  const cached = bannerCache.get(key);
  if (cached) return cached;

  const fetched = await fetchImageBytes(key);
  if (!fetched) return null;

  const decoded = decodeBannerWithPalette(fetched.bytes, 1000);
  if (decoded) {
    rememberBounded(bannerCache, key, decoded, MAX_BANNER_CACHE_ENTRIES);
  }
  return decoded;
}

function charWeight(char: string): number {
  const code = char.codePointAt(0) ?? 0;
  return code <= 0xff ? 0.55 : 1;
}

function weightedLength(text: string): number {
  let total = 0;
  for (const char of text) {
    total += charWeight(char);
  }
  return total;
}

function truncateWeighted(text: string, maxWeight: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  let weight = 0;
  let result = '';
  for (const char of normalized) {
    const nextWeight = weight + charWeight(char);
    if (nextWeight > maxWeight) {
      return `${result.trimEnd()}…`;
    }
    weight = nextWeight;
    result += char;
  }
  return result;
}

function formatZhDate(date: Date): string {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return '';
  // Format consistently in Asia/Shanghai (+08:00) across Workers isolates.
  const utc8 = new Date(timestamp + 8 * 60 * 60 * 1000);
  const year = utc8.getUTCFullYear();
  const month = String(utc8.getUTCMonth() + 1).padStart(2, '0');
  const day = String(utc8.getUTCDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

export async function renderHomeOgImage(): Promise<Response> {
  const [avatarDataUri, fonts] = await Promise.all([
    getAvatarDataUri(),
    loadNotoSansScFonts(`${SITE_TITLE}${SITE_DESCRIPTION}${SITE_DOMAIN}W`),
  ]);

  return ImageResponse.async(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 88px',
        backgroundColor: '#faf9f5',
        backgroundImage:
          'radial-gradient(circle at 86% 14%, rgba(214, 224, 214, 0.42), rgba(214, 224, 214, 0) 50%), radial-gradient(circle at 12% 88%, rgba(242, 226, 208, 0.46), rgba(242, 226, 208, 0) 48%)',
        fontFamily: '"Noto Sans SC", sans-serif',
      }}
    >
      <div style={{ height: 22 }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 44,
        }}
      >
        <div
          style={{
            width: 124,
            height: 124,
            borderRadius: 9999,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f4f2eb',
            boxShadow: '0 10px 28px rgba(11, 13, 11, 0.10)',
            flexShrink: 0,
          }}
        >
          {avatarDataUri ? (
            <img
              alt=''
              src={avatarDataUri}
              width={124}
              height={124}
              style={{ width: 124, height: 124, objectFit: 'cover', borderRadius: 9999 }}
            />
          ) : (
            <span style={{ fontSize: 48, fontWeight: 500, color: '#2f372f' }}>W</span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 58,
              fontWeight: 500,
              color: '#0b0d0b',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {SITE_TITLE}
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: '#595959',
              lineHeight: 1.5,
            }}
          >
            {SITE_DESCRIPTION}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 18, color: '#9a9d98', letterSpacing: '0.02em' }}>
          {SITE_DOMAIN}
        </span>
      </div>
    </div>,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts,
      headers: OG_CACHE_HEADERS,
    },
  );
}

export async function renderPostOgImage(post: OgPostData): Promise<Response> {
  const [avatarDataUri, banner] = await Promise.all([
    getAvatarDataUri(),
    getBannerWithPalette(post.banner),
  ]);

  const rawTitle = (post.title ?? '').trim() || SITE_TITLE;
  const rawExcerpt = (post.description ?? post.summary ?? '').trim();
  const formattedDate = formatZhDate(post.createdAt);

  const hasBanner = banner !== null;
  const palette = banner?.palette ?? DEFAULT_LIGHT_PALETTE;
  const [bgR, bgG, bgB] = palette.bgRgb;
  const titleText = truncateWeighted(rawTitle, hasBanner ? 48 : 60);
  const excerptText = rawExcerpt ? truncateWeighted(rawExcerpt, hasBanner ? 68 : 100) : '';

  const titleWeightLen = weightedLength(titleText);
  const titleFontSize = hasBanner
    ? titleWeightLen <= 14
      ? 52
      : titleWeightLen <= 26
        ? 44
        : 38
    : titleWeightLen <= 16
      ? 56
      : titleWeightLen <= 30
        ? 48
        : 40;

  const fonts = await loadNotoSansScFonts(
    `${SITE_TITLE}${SITE_DOMAIN}${formattedDate}${titleText}${excerptText}W`,
  );

  return ImageResponse.async(
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: palette.bgHex,
        ...(hasBanner
          ? {}
          : {
              backgroundImage:
                'radial-gradient(circle at 86% 14%, rgba(214, 224, 214, 0.42), rgba(214, 224, 214, 0) 50%), radial-gradient(circle at 12% 88%, rgba(242, 226, 208, 0.46), rgba(242, 226, 208, 0) 48%)',
            }),
        fontFamily: '"Noto Sans SC", sans-serif',
      }}
    >
      {hasBanner ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 760,
            height: 630,
            display: 'flex',
          }}
        >
          <img
            alt=''
            src={banner.dataUri}
            width={760}
            height={630}
            style={{ width: 760, height: 630, objectFit: 'cover' }}
          />
        </div>
      ) : null}

      {hasBanner ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: `linear-gradient(to right, rgba(${bgR}, ${bgG}, ${bgB}, 1) 0%, rgba(${bgR}, ${bgG}, ${bgB}, 1) 37%, rgba(${bgR}, ${bgG}, ${bgB}, 0.96) 45%, rgba(${bgR}, ${bgG}, ${bgB}, 0.85) 53%, rgba(${bgR}, ${bgG}, ${bgB}, 0.64) 61%, rgba(${bgR}, ${bgG}, ${bgB}, 0.38) 70%, rgba(${bgR}, ${bgG}, ${bgB}, 0.16) 80%, rgba(${bgR}, ${bgG}, ${bgB}, 0.04) 90%, rgba(${bgR}, ${bgG}, ${bgB}, 0) 100%)`,
          }}
        />
      ) : null}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 76px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9999,
              border: `1px solid ${palette.avatarRing}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.bgHex,
              flexShrink: 0,
            }}
          >
            {avatarDataUri ? (
              <img
                alt=''
                src={avatarDataUri}
                width={36}
                height={36}
                style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 9999 }}
              />
            ) : (
              <span style={{ fontSize: 15, fontWeight: 500, color: palette.titleColor }}>W</span>
            )}
          </div>
          <span style={{ fontSize: 19, fontWeight: 500, color: palette.brandColor }}>
            {SITE_TITLE}
          </span>
          {formattedDate ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 18, color: palette.dotColor }}>·</span>
              <span style={{ fontSize: 18, color: palette.metaColor, fontWeight: 400 }}>
                {formattedDate}
              </span>
            </div>
          ) : null}
        </div>

        {hasBanner ? (
          <div
            style={{
              maxWidth: 600,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <span
              style={{
                fontSize: titleFontSize,
                fontWeight: 500,
                color: palette.titleColor,
                lineHeight: 1.26,
                letterSpacing: '-0.02em',
              }}
            >
              {titleText}
            </span>
            {excerptText ? (
              <span
                style={{
                  fontSize: 21,
                  fontWeight: 400,
                  color: palette.excerptColor,
                  lineHeight: 1.62,
                }}
              >
                {excerptText}
              </span>
            ) : null}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              maxWidth: 960,
            }}
          >
            <span
              style={{
                fontSize: titleFontSize,
                fontWeight: 500,
                color: palette.titleColor,
                lineHeight: 1.24,
                letterSpacing: '-0.02em',
              }}
            >
              {titleText}
            </span>
            <div
              style={{
                width: 40,
                height: 2,
                borderRadius: 2,
                backgroundColor: '#c5cec5',
              }}
            />
            {excerptText ? (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  color: palette.excerptColor,
                  lineHeight: 1.62,
                }}
              >
                {excerptText}
              </span>
            ) : null}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 17, color: palette.metaColor, letterSpacing: '0.02em' }}>
            {SITE_DOMAIN}
          </span>
        </div>
      </div>
    </div>,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts,
      headers: OG_CACHE_HEADERS,
    },
  );
}
