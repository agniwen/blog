import { DetailedError, parseResponse } from 'hono/client';

import { hono } from '~/lib/hono';

export async function fetchSession() {
  const res = await parseResponse(hono.api.session.$get());
  return res.data;
}

export async function fetchPublicPosts() {
  const res = await parseResponse(hono.api.posts.public.$get());
  return res.data;
}

export async function fetchPublicPost(id: string) {
  try {
    const res = await parseResponse(hono.api.posts.public[':id'].$get({ param: { id } }));
    return res.data;
  } catch (error) {
    if (error instanceof DetailedError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchAdminPost(id: string) {
  return parseResponse(hono.api.posts[':id'].$get({ param: { id } }));
}

export async function fetchPublicComments(postId: string) {
  const res = await parseResponse(hono.api.comments.public[':postId'].$get({ param: { postId } }));
  return res.data;
}

export async function createComment(data: { postId: string; content: string; parentId?: string }) {
  const res = await parseResponse(hono.api.comments.$post({ json: data }));
  return res.data;
}

export async function deleteComment(id: string) {
  const res = await parseResponse(hono.api.comments[':id'].$delete({ param: { id } }));
  return res.data;
}

export type PostSummary = Awaited<ReturnType<typeof fetchPublicPosts>>[number];
export type PostDetail = Awaited<ReturnType<typeof fetchPublicPost>>;
export type PublicComment = Awaited<ReturnType<typeof fetchPublicComments>>[number];
