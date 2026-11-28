import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware, userAuthMiddleware } from '~/server/middleware/auth';

const replySchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().min(1).optional(),
  content: z.string().trim().min(1, '回复内容不能为空').max(10000),
});

const commentParamSchema = z.object({
  id: z.string().min(1),
});

const postParamSchema = z.object({
  postId: z.string().min(1),
});

export const commentsRouter = factory
  .createApp()
  .get('/', authMiddleware, async (c) => {
    const list = await c.var.db.query.comments.findMany({
      orderBy: { createdAt: 'desc' },
      with: {
        user: {
          columns: { id: true, name: true, email: true, image: true, role: true, banned: true },
        },
        post: {
          columns: { id: true, title: true, published: true },
        },
      },
    });
    return c.json(success(list));
  })
  // 公开读取已发布文章的评论列表
  .get('/public/:postId', zValidator('param', postParamSchema), async (c) => {
    const { postId } = c.req.valid('param');
    const post = await c.var.db.query.posts.findFirst({
      where: { id: postId, published: true },
      columns: { id: true },
    });
    if (!post) {
      c.header('Cache-Control', 'private, no-store');
      return c.json(success([]));
    }
    const list = await c.var.db.query.comments.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      with: { user: { columns: { id: true, name: true, image: true, role: true } } },
    });
    c.header('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    return c.json(success(list));
  })
  // 登录用户发表评论或回复
  .post('/', userAuthMiddleware, zValidator('json', replySchema), async (c) => {
    if (c.var.user!.banned) {
      return c.json({ message: 'Account is banned' }, 403);
    }
    const data = c.req.valid('json');
    const post = await c.var.db.query.posts.findFirst({
      where: { id: data.postId, published: true },
      columns: { id: true },
    });
    if (!post) {
      return c.json({ message: 'Post not found' }, 404);
    }

    if (data.parentId) {
      const parent = await c.var.db.query.comments.findFirst({
        where: { id: data.parentId, postId: data.postId },
        columns: { id: true },
      });
      if (!parent) {
        return c.json({ message: 'Parent comment not found' }, 404);
      }
    }

    const [created] = await c.var.db
      .insert(comments)
      .values({
        postId: data.postId,
        parentId: data.parentId,
        content: data.content,
        userId: c.var.user!.id,
        createdAt: new Date(),
      })
      .returning();
    return c.json(success(created));
  })
  .post('/reply', authMiddleware, zValidator('json', replySchema), async (c) => {
    const data = c.req.valid('json');
    const [created] = await c.var.db
      .insert(comments)
      .values({
        postId: data.postId,
        parentId: data.parentId,
        content: data.content,
        userId: c.var.user!.id,
        createdAt: new Date(),
      })
      .returning();
    return c.json(success(created));
  })
  .delete('/:id', userAuthMiddleware, zValidator('param', commentParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    const target = await c.var.db.query.comments.findFirst({
      where: { id },
      columns: { id: true, userId: true },
    });
    if (!target) {
      return c.json({ message: '评论不存在' }, 404);
    }
    if (target.userId !== c.var.user!.id && c.var.user!.role !== 'admin') {
      return c.json({ message: 'Forbidden' }, 403);
    }
    const [, [deleted]] = await c.var.db.batch([
      c.var.db.delete(comments).where(eq(comments.parentId, id)),
      c.var.db.delete(comments).where(eq(comments.id, id)).returning(),
    ]);
    return c.json(success(deleted));
  });
