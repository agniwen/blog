import { createFileRoute } from '@tanstack/react-router';

import { clientEnv } from '~/lib/client-env';
import { db } from '~/lib/db';

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
  );
}
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await db().query.posts.findMany({
          where: { published: true },
          columns: { id: true, updatedAt: true },
        });
        const origin = clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL.replace(/\/$/, '');
        const urls = [
          { url: origin, frequency: 'daily', priority: '1', updatedAt: null },
          { url: `${origin}/blog`, frequency: 'daily', priority: '0.9', updatedAt: null },
          ...posts.map((post) => ({
            url: `${origin}/blog/${encodeURIComponent(post.id)}`,
            frequency: 'weekly',
            priority: '0.8',
            updatedAt: post.updatedAt,
          })),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((item) => `<url><loc>${escapeXml(item.url)}</loc>${item.updatedAt ? `<lastmod>${item.updatedAt.toISOString()}</lastmod>` : ''}<changefreq>${item.frequency}</changefreq><priority>${item.priority}</priority></url>`).join('')}</urlset>`;
        return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
      },
    },
  },
});
