import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { auth } from '~/lib/auth';
import { db } from '~/lib/db';

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
      with: { user: { columns: { id: true, name: true, image: true } } },
    });
  });

export const createComment = createServerFn({ method: 'POST' })
  .validator(z.object({ postId: z.string().min(1), content: z.string().trim().min(1).max(10000) }))
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error('Unauthorized');
    const post = await db().query.posts.findFirst({
      where: { id: data.postId, published: true },
      columns: { id: true },
    });
    if (!post) throw new Error('Post not found');
    const [comment] = await db()
      .insert(comments)
      .values({
        ...data,
        createdAt: new Date(),
        userId: session.user.id,
      })
      .returning();
    return comment;
  });
