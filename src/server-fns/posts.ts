import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '~/lib/db';

export const getPublishedPostsServerFn = createServerFn({ method: 'GET' }).handler(async () => {
  const posts = await db().query.posts.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts.map(post => ({
    ...post,
    jsonContent: (post.jsonContent ?? {}) as Record<string, object>,
  }));
});

export const getPublishedPostServerFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const post = await db().query.posts.findFirst({
      where: {
        id: data.id,
        published: true,
      },
    });
    if (!post) {
      return null;
    }
    return {
      ...post,
      jsonContent: (post.jsonContent ?? {}) as Record<string, object>,
    };
  });
