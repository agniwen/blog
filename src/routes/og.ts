import { createFileRoute } from '@tanstack/react-router';

import { db } from '~/lib/db';
import { renderHomeOgImage, renderPostOgImage } from '~/lib/og';

/**
 * 动态 OG 图片服务端路由：
 * - `GET /og`：返回首页卡片；
 * - `GET /og?id=<postId>`：仅渲染 `published: true` 的已发布文章卡片，草稿或缺失统一返回 404 `no-store`。
 */
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
