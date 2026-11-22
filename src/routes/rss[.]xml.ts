import { createFileRoute } from '@tanstack/react-router';

import { db } from '~/lib/db';
import { getSiteOrigin, SITE_DESCRIPTION, SITE_TITLE } from '~/lib/site-meta';

/** 转义 XML 特殊字符，防止文章标题或摘要破坏 RSS 文档结构。 */
function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
  );
}

/** RSS 2.0 订阅源路由：按创建时间倒序仅输出 `published: true` 的已发布文章，严禁包含草稿。 */
export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await db().query.posts.findMany({
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          columns: {
            id: true,
            title: true,
            description: true,
            summary: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        const origin = getSiteOrigin();
        const feedUrl = `${origin}/rss.xml`;
        const lastBuildDate = (
          posts[0]?.updatedAt ??
          posts[0]?.createdAt ??
          new Date()
        ).toUTCString();

        const items = posts
          .map((post) => {
            const link = `${origin}/blog/${encodeURIComponent(post.id)}`;
            const title = escapeXml(post.title?.trim() || 'Untitled');
            const description = escapeXml(post.description?.trim() || post.summary?.trim() || '');
            const pubDate = new Date(post.createdAt).toUTCString();
            return `<item><title>${title}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${pubDate}</pubDate><description>${description}</description></item>`;
          })
          .join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(SITE_TITLE)}</title><link>${escapeXml(origin)}</link><description>${escapeXml(SITE_DESCRIPTION)}</description><language>zh-CN</language><lastBuildDate>${lastBuildDate}</lastBuildDate><atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        });
      },
    },
  },
});
