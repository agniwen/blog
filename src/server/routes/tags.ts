import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { postTags, tags } from '~/db/schema';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

const tagBodySchema = z.object({
  name: z.string().trim().min(1, '标签名称不能为空').max(40, '标签名称不能超过 40 字'),
});

const tagParamSchema = z.object({
  id: z.string().min(1),
});

export const tagsRouter = factory
  .createApp()
  .get('/', authMiddleware, async (c) => {
    const list = await c.var.db.query.tags.findMany({
      orderBy: { createdAt: 'desc' },
      with: {
        posts: {
          columns: { id: true },
        },
      },
    });
    return c.json(
      success(
        list.map(({ posts: linkedPosts, ...tag }) => ({
          ...tag,
          postCount: linkedPosts.length,
        })),
      ),
    );
  })
  .post('/', authMiddleware, zValidator('json', tagBodySchema), async (c) => {
    const { name } = c.req.valid('json');
    const existing = await c.var.db.query.tags.findFirst({ where: { name } });
    if (existing) {
      return c.json({ message: '标签已存在' }, 409);
    }
    const now = new Date();
    const [created] = await c.var.db
      .insert(tags)
      .values({
        id: createId(),
        name,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return c.json(success({ ...created, postCount: 0 }));
  })
  .put(
    '/:id',
    authMiddleware,
    zValidator('param', tagParamSchema),
    zValidator('json', tagBodySchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { name } = c.req.valid('json');
      const existing = await c.var.db.query.tags.findFirst({ where: { name } });
      if (existing && existing.id !== id) {
        return c.json({ message: '标签名称已存在' }, 409);
      }
      const [updated] = await c.var.db
        .update(tags)
        .set({ name, updatedAt: new Date() })
        .where(eq(tags.id, id))
        .returning();
      if (!updated) {
        return c.json({ message: '标签不存在' }, 404);
      }
      return c.json(success(updated));
    },
  )
  .delete('/:id', authMiddleware, zValidator('param', tagParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    await c.var.db.delete(postTags).where(eq(postTags.tagId, id));
    const [deleted] = await c.var.db.delete(tags).where(eq(tags.id, id)).returning();
    if (!deleted) {
      return c.json({ message: '标签不存在' }, 404);
    }
    return c.json(success(deleted));
  });
