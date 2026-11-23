import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { getAuth } from '~/lib/auth';
import { db } from '~/lib/db';

/** 读取指定已发布文章下的评论列表（包含评论者基础公开信息）；未发布或不存在返回空数组。 */
export const getComments = createServerFn({ method: 'GET' })
  .validator(z.string().min(1))
  .handler(async ({ data: postId }) => {
    const post = await db().query.posts.findFirst({
      where: { id: postId, published: true },
      columns: { id: true },
    });
    if (!post) return [];
    return db().query.comments.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      with: { user: { columns: { id: true, name: true, image: true, role: true } } },
    });
  });

/** 发表评论或回复 Server Function：服务端独立校验登录态、封禁状态与目标文章的 `published: true` 状态。 */
export const createComment = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      postId: z.string().min(1),
      content: z.string().trim().min(1).max(10000),
      parentId: z.string().min(1).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error('Unauthorized');
    if (session.user.banned) throw new Error('Account is banned');

    const post = await db().query.posts.findFirst({
      where: { id: data.postId, published: true },
      columns: { id: true },
    });
    if (!post) throw new Error('Post not found');

    if (data.parentId) {
      const parent = await db().query.comments.findFirst({
        where: { id: data.parentId, postId: data.postId },
        columns: { id: true },
      });
      if (!parent) throw new Error('Parent comment not found');
    }

    const [comment] = await db()
      .insert(comments)
      .values({
        postId: data.postId,
        parentId: data.parentId,
        content: data.content,
        createdAt: new Date(),
        userId: session.user.id,
      })
      .returning();
    return comment;
  });

/** 删除评论 Server Function：仅评论作者本人或管理员可删除，级联清理子回复。 */
export const deleteComment = createServerFn({ method: 'POST' })
  .validator(z.string().min(1))
  .handler(async ({ data: commentId }) => {
    const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error('Unauthorized');

    const target = await db().query.comments.findFirst({
      where: { id: commentId },
      columns: { id: true, userId: true },
    });
    if (!target) throw new Error('Comment not found');

    if (target.userId !== session.user.id && session.user.role !== 'admin') {
      throw new Error('Forbidden');
    }

    await db().delete(comments).where(eq(comments.parentId, commentId));
    const [deleted] = await db().delete(comments).where(eq(comments.id, commentId)).returning();
    return deleted;
  });
