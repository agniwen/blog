import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { comments, posts, postTags } from '~/db/schema';
import { fail, success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

import { postsCreateSchema, postsDetailSchema, postsUpdateSchema } from './schema';

export const postsRouter = factory
  .createApp()
  // 管理端获取全部文章列表
  .get('/', authMiddleware, async (c) => {
    const list = await c.var.db.query.posts.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      with: {
        tags: {
          columns: { id: true, name: true },
        },
      },
    });
    return c.json(success(list));
  })
  // 公开文章列表查询：仅返回已发布文章摘要并剔除正文大字段
  .get('/public', async (c) => {
    const list = await c.var.db.query.posts.findMany({
      columns: { jsonContent: false, htmlContent: false, textContent: false },
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      with: {
        tags: { columns: { id: true, name: true } },
      },
    });
    return c.json(success(list));
  })
  // 公开文章详情查询：仅返回已发布文章正文，草稿或缺失返回 404
  .get('/public/:id', zValidator('param', postsDetailSchema), async (c) => {
    const { id } = c.req.valid('param');
    const post = await c.var.db.query.posts.findFirst({
      columns: { jsonContent: false, textContent: false },
      where: { id, published: true },
      with: {
        tags: { columns: { id: true, name: true } },
      },
    });
    if (!post) {
      c.header('Cache-Control', 'private, no-store');
      return c.json(fail('Post not found'), 404);
    }
    return c.json(success(post));
  })
  // 创建文章
  .post('/', authMiddleware, zValidator('json', postsCreateSchema), async (c) => {
    const { tagIds, ...data } = c.req.valid('json');
    const uniqueTagIds = tagIds ? [...new Set(tagIds)] : [];
    const id = createId();

    if (uniqueTagIds.length > 0) {
      const [[res]] = await c.var.db.batch([
        c.var.db
          .insert(posts)
          .values({ id, ...data })
          .returning(),
        c.var.db
          .insert(postTags)
          .values(uniqueTagIds.map((tagId) => ({ postId: id, tagId }))),
      ]);
      return c.json(success(res));
    }

    const [res] = await c.var.db
      .insert(posts)
      .values({ id, ...data })
      .returning();
    return c.json(success(res));
  })
  // 修改文章
  .put('/', authMiddleware, zValidator('json', postsUpdateSchema), async (c) => {
    const { id, tagIds, ...rest } = c.req.valid('json');
    if (tagIds !== undefined) {
      const uniqueTagIds = [...new Set(tagIds)];
      const updateQuery = c.var.db
        .update(posts)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();
      const deleteTagsQuery = c.var.db.delete(postTags).where(eq(postTags.postId, id));

      if (uniqueTagIds.length > 0) {
        const [[res]] = await c.var.db.batch([
          updateQuery,
          deleteTagsQuery,
          c.var.db
            .insert(postTags)
            .values(uniqueTagIds.map((tagId) => ({ postId: id, tagId }))),
        ]);
        return c.json(success(res));
      }

      const [[res]] = await c.var.db.batch([updateQuery, deleteTagsQuery]);
      return c.json(success(res));
    }

    const [res] = await c.var.db
      .update(posts)
      .set({
        ...rest,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    return c.json(success(res));
  })
  // 管理端获取文章详情（含草稿与编辑用 JSON 内容）
  .get('/:id', authMiddleware, zValidator('param', postsDetailSchema), async (c) => {
    const { id } = c.req.valid('param');
    const post = await c.var.db.query.posts.findFirst({
      where: { id },
      with: {
        tags: { columns: { id: true, name: true } },
      },
    });
    return c.json(
      success(post ? { ...post, jsonContent: z.json().parse(post.jsonContent) } : null),
    );
  })
  // 删除文章
  .delete('/:id', authMiddleware, zValidator('param', postsDetailSchema), async (c) => {
    const { id } = c.req.valid('param');
    const [, , [deleted]] = await c.var.db.batch([
      c.var.db.delete(postTags).where(eq(postTags.postId, id)),
      c.var.db.delete(comments).where(eq(comments.postId, id)),
      c.var.db.delete(posts).where(eq(posts.id, id)).returning(),
    ]);
    return c.json(success(deleted));
  });
