import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders, setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';

import { getAuth } from '~/lib/auth';
import { db } from '~/lib/db';
import { success } from '~/lib/result';

/** 获取当前登录会话的最小脱敏身份信息；强制 `private, no-store` 防止会话被缓存。 */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store');
  const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
  return session ? { user: { id: session.user.id, role: session.user.role } } : null;
});

/** 公开文章列表查询：仅返回已发布文章摘要并剔除正文大字段，供首页列表与缓存预填充使用。 */
export const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return db().query.posts.findMany({
    columns: { jsonContent: false, htmlContent: false, textContent: false },
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    with: {
      tags: { columns: { id: true, name: true } },
    },
  });
});

/** 公开文章详情查询：按 ID 仅读取 `published: true` 的文章正文，草稿或不存在返回 `null`。 */
export const getPost = createServerFn({ method: 'GET' })
  .validator(z.string().min(1))
  .handler(async ({ data: id }) => {
    return (
      (await db().query.posts.findFirst({
        columns: { jsonContent: false, textContent: false },
        where: { id, published: true },
        with: {
          tags: { columns: { id: true, name: true } },
        },
      })) ?? null
    );
  });

/** 管理端文章详情查询：强制校验 `admin` 角色并禁用缓存，返回完整草稿与编辑用 JSON 内容。 */
export const getAdminPost = createServerFn({ method: 'GET' })
  .validator(z.string().min(1))
  .handler(async ({ data: id }) => {
    setResponseHeader('Cache-Control', 'private, no-store');
    const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
    if (session?.user.role !== 'admin') throw new Error('Unauthorized');
    const post = await db().query.posts.findFirst({
      where: { id },
      with: {
        tags: { columns: { id: true, name: true } },
      },
    });
    return success(post ? { ...post, jsonContent: z.json().parse(post.jsonContent) } : null);
  });
