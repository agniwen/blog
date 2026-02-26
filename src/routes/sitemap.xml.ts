import { createFileRoute } from '@tanstack/react-router';
import { getPublishedPostsServerFn } from '~/server-fns/posts';

export const Route = createFileRoute('/sitemap/xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = 'https://blog.baka.wiki';
        const posts = await getPublishedPostsServerFn();
        const urls = [
          '/',
          '/blog',
          ...posts.map(post => `/blog/${post.id}`),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map(url => `  <url><loc>${base}${url}</loc></url>`)
          .join('\n')}\n</urlset>`;

        return new Response(body, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
          },
        });
      },
    },
  },
});
