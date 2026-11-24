import { Element, isText } from 'domhandler';
import { parseDocument } from 'htmlparser2';

export interface ParsedOgMeta {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.goog',
]);

function isBlockedIpv4(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4 || parts.some((p) => !/^\d+$/.test(p))) return false;
  const nums = parts.map(Number);
  if (nums.some((n) => n < 0 || n > 255)) return false;
  const [a, b] = nums;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isBlockedIpv6(host: string): boolean {
  const clean = host.replace(/^\[|\]$/g, '').toLowerCase();
  if (!clean.includes(':')) return false;
  if (clean === '::1' || clean === '::' || clean === '0:0:0:0:0:0:0:1') return true;
  if (clean.startsWith('fc') || clean.startsWith('fd')) return true;
  if (/^fe[89ab][0-9a-f]:/.test(clean)) return true;
  if (clean.startsWith('::ffff:')) {
    const mapped = clean.slice('::ffff:'.length);
    if (isBlockedIpv4(mapped)) return true;
    const hexMatch = /^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(mapped);
    if (hexMatch) {
      const hi = Number.parseInt(hexMatch[1], 16);
      const lo = Number.parseInt(hexMatch[2], 16);
      const ipv4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
      if (isBlockedIpv4(ipv4)) return true;
    }
  }
  return false;
}

/**
 * 校验外部抓取 URL 是否安全：仅允许无凭据的公网 http/https 地址，拦截内网、回环与元数据主机。
 */
export function assertSafeUrl(rawUrl: string): URL {
  const url = new URL(rawUrl);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }
  if (url.username || url.password) {
    throw new Error('URLs with credentials are not allowed');
  }
  const hostname = url.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    isBlockedIpv4(hostname) ||
    isBlockedIpv6(hostname)
  ) {
    throw new Error('Blocked private or internal host');
  }
  return url;
}

/**
 * 带 SSRF 校验、重定向追踪与超时控制的外部抓取封装。
 */
export async function safeFetch(
  rawUrl: string,
  maxRedirects = 3,
  timeoutMs = 8000,
): Promise<Response> {
  let currentUrl = assertSafeUrl(rawUrl).href;
  const signal = AbortSignal.timeout(timeoutMs);

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const response = await fetch(currentUrl, {
      signal,
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error('Redirect response missing Location header');
      }
      if (hop === maxRedirects) {
        throw new Error('Too many redirects');
      }
      currentUrl = assertSafeUrl(new URL(location, currentUrl).href).href;
      continue;
    }

    return response;
  }

  throw new Error('Too many redirects');
}

/**
 * 流式读取响应体并强制限制最大字节数，防止超大响应导致 Worker OOM。
 */
export async function readResponseBytes(response: Response, maxBytes: number): Promise<Uint8Array> {
  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > maxBytes) {
      await response.body?.cancel();
      throw new Error(`Response exceeds ${maxBytes} byte limit`);
    }
  }

  if (!response.body) {
    return new Uint8Array(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`Response exceeds ${maxBytes} byte limit`);
    }
    chunks.push(value);
  }

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function getTextContent(node: Element): string {
  let text = '';
  for (const child of node.children) {
    if (isText(child)) text += child.data;
    else if (child instanceof Element) text += getTextContent(child);
  }
  return text.trim();
}

function walkElements(nodes: ReturnType<typeof parseDocument>['children'], visit: (el: Element) => void) {
  for (const node of nodes) {
    if (node instanceof Element) {
      visit(node);
      if (node.children.length > 0) {
        walkElements(node.children, visit);
      }
    }
  }
}

/**
 * 使用 `htmlparser2` 解析 HTML 文档中的 Open Graph 与基础站点元信息。
 */
export function extractOgMeta(html: string, baseUrl: string): ParsedOgMeta {
  const doc = parseDocument(html);
  let ogTitle: string | undefined;
  let ogDescription: string | undefined;
  let ogImage: string | undefined;
  let ogSiteName: string | undefined;
  let metaDescription: string | undefined;
  let titleTag: string | undefined;
  let faviconHref: string | undefined;

  walkElements(doc.children, (el) => {
    const tag = el.name.toLowerCase();
    if (tag === 'title' && !titleTag) {
      const text = getTextContent(el);
      if (text) titleTag = text;
      return;
    }

    if (tag === 'meta') {
      const prop = el.attribs.property?.toLowerCase();
      const name = el.attribs.name?.toLowerCase();
      const content = el.attribs.content?.trim();
      if (!content) return;
      if (prop === 'og:title' && !ogTitle) ogTitle = content;
      else if (prop === 'og:description' && !ogDescription) ogDescription = content;
      else if (prop === 'og:image' && !ogImage) ogImage = content;
      else if (prop === 'og:site_name' && !ogSiteName) ogSiteName = content;
      else if (name === 'description' && !metaDescription) metaDescription = content;
      return;
    }

    if (tag === 'link' && !faviconHref) {
      const relTokens = (el.attribs.rel || '').toLowerCase().split(/\s+/);
      const href = el.attribs.href?.trim();
      if (
        href &&
        (relTokens.includes('icon') ||
          (relTokens.includes('shortcut') && relTokens.includes('icon')) ||
          relTokens.includes('apple-touch-icon'))
      ) {
        faviconHref = href;
      }
    }
  });

  const base = new URL(baseUrl);
  const resolveUrl = (relativeUrl?: string) => {
    if (!relativeUrl) return undefined;
    try {
      return new URL(relativeUrl, base).href;
    } catch {
      return undefined;
    }
  };

  return {
    title: ogTitle || titleTag,
    description: ogDescription || metaDescription,
    image: resolveUrl(ogImage),
    siteName: ogSiteName,
    favicon: resolveUrl(faviconHref),
  };
}
