import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import type { z } from 'zod';

import { posts } from '~/db/schema';
import { db } from '~/lib/db';

import type { postsCreateSchema } from './_schema';

export type PostInput = z.infer<typeof postsCreateSchema>;
export function listAdminPosts() {
  return db().query.posts.findMany({ orderBy: { createdAt: 'desc' } });
}
export async function readAdminPost(id: string) {
  const post = await db().query.posts.findFirst({ where: { id } });
  if (!post) throw new HTTPException(404, { message: 'Post not found' });
  return post;
}
export async function createPost(data: PostInput = {}) {
  const [post] = await db().insert(posts).values(data).returning();
  return post;
}
export async function updatePost(id: string, data: PostInput) {
  const [post] = await db().update(posts).set(data).where(eq(posts.id, id)).returning();
  if (!post) throw new HTTPException(404, { message: 'Post not found' });
  return post;
}
export async function deletePost(id: string) {
  const [post] = await db().delete(posts).where(eq(posts.id, id)).returning();
  return post;
}

export function listPublishedPosts() {
  return db().query.posts.findMany({
    columns: { jsonContent: false, htmlContent: false, textContent: false },
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
}
export async function readPublishedPost(id: string) {
  const post = await db().query.posts.findFirst({
    columns: { jsonContent: false, textContent: false },
    where: { id, published: true },
  });
  if (!post) throw new HTTPException(404, { message: 'Post not found' });
  return post;
}
export function listComments(postId: string) {
  return db().query.comments.findMany({
    where: { postId },
    with: { user: { columns: { id: true, name: true, image: true } } },
  });
}
