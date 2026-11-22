import { clientEnv } from '~/lib/client-env';

/** 全站默认标题、简介、主域名及标准 OG 图尺寸，供页面 head、RSS 与 OG 生成共享。 */
export const SITE_TITLE = "Wen's Blog";
export const SITE_DESCRIPTION = '总有一天，我会在这里写下些什么...';
export const SITE_DOMAIN = 'akumanoko.com';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** 返回去除末尾斜杠的公开站点根地址，避免拼接 URL 出现双斜杠。 */
export function getSiteOrigin(): string {
  return clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL.replace(/\/$/, '');
}

/** 构造首页 / 默认 OG 图片 URL。 */
export function buildHomeOgUrl(origin: string): string {
  return `${origin}/og`;
}

/** 构造文章页 OG 图片 URL，并附带 `v=<updatedAt>` 参数以便更新文章后刷新社交平台缓存。 */
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
