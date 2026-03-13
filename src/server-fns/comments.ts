import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { auth } from '~/lib/auth';
import { db } from '~/lib/db';

export const getCommentsServerFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ postId: z.string() }))
  .handler(async ({ data }) => {
    return db().query.comments.findMany({
      where: {
        postId: data.postId,
      },
      with: {
        user: true,
      },
    });
  });

export const createCommentServerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ postId: z.string(), content: z.string() }))
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    if (!session) {
      throw new Error('Unauthorized');
    }

    const [comment] = await db()
      .insert(comments)
      .values({
        postId: data.postId,
        content: data.content,
        createdAt: new Date(),
        userId: session.user.id,
      })
      .returning();

    return comment;
  });
