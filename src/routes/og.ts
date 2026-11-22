import { createFileRoute } from '@tanstack/react-router';

import { db } from '~/lib/db';
import { renderHomeOgImage, renderPostOgImage } from '~/lib/og';

export const Route = createFileRoute('/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get('id')?.trim();
        if (!id) {
          return renderHomeOgImage();
        }

        const post = await db().query.posts.findFirst({
          where: { id, published: true },
          columns: {
            id: true,
            title: true,
            description: true,
            summary: true,
            banner: true,
            createdAt: true,
          },
        });

        if (!post) {
          return new Response('Not Found', {
            status: 404,
            headers: { 'Cache-Control': 'private, no-store' },
          });
        }

        return renderPostOgImage(post);
      },
    },
  },
});
