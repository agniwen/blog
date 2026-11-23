import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

const replySchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().min(1).optional(),
  content: z.string().trim().min(1, '回复内容不能为空').max(10000),
});

const commentParamSchema = z.object({
  id: z.string().min(1),
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
  .delete('/:id', authMiddleware, zValidator('param', commentParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    await c.var.db.delete(comments).where(eq(comments.parentId, id));
    const [deleted] = await c.var.db.delete(comments).where(eq(comments.id, id)).returning();
    if (!deleted) {
      return c.json({ message: '评论不存在' }, 404);
    }
    return c.json(success(deleted));
  });
