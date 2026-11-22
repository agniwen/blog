import { clientEnv } from '~/lib/client-env';

export const SITE_TITLE = "Wen's Blog";
export const SITE_DESCRIPTION = '总有一天，我会在这里写下些什么...';
export const SITE_DOMAIN = 'akumanoko.com';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function getSiteOrigin(): string {
  return clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL.replace(/\/$/, '');
}

export function buildHomeOgUrl(origin: string): string {
  return `${origin}/og`;
}

export function buildPostOgUrl(
  origin: string,
  id: string,
  updatedAt?: Date | string | number | null,
): string {
  const base = `${origin}/og?id=${encodeURIComponent(id)}`;
  if (!updatedAt) return base;
  const timestamp = new Date(updatedAt).getTime();
  return Number.isFinite(timestamp) && timestamp > 0 ? `${base}&v=${timestamp}` : base;
}
