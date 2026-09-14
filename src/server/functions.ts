import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders, setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';

import { auth } from '~/lib/auth';
import { db } from '~/lib/db';
import { success } from '~/lib/result';

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store');
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  return session ? { user: { id: session.user.id, role: session.user.role } } : null;
});

export const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return db().query.posts.findMany({
    columns: { jsonContent: false, htmlContent: false, textContent: false },
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
});

export const getPost = createServerFn({ method: 'GET' })
  .validator(z.string().min(1))
  .handler(async ({ data: id }) => {
    return (
      (await db().query.posts.findFirst({
        columns: { jsonContent: false, textContent: false },
        where: { id, published: true },
      })) ?? null
    );
  });

export const getAdminPost = createServerFn({ method: 'GET' })
  .validator(z.string().min(1))
  .handler(async ({ data: id }) => {
    setResponseHeader('Cache-Control', 'private, no-store');
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (session?.user.role !== 'admin') throw new Error('Unauthorized');
    const post = await db().query.posts.findFirst({ where: { id } });
    return success(post ? { ...post, jsonContent: z.json().parse(post.jsonContent) } : null);
  });
