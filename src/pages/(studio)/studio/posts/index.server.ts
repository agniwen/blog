import { defineHandler, type InferProps } from 'void';
import { z } from 'zod';

import { requireAdmin } from '~/lib/auth-guards';
import { listAdminPosts, createPost, deletePost } from '~/routes/api/posts/_data';

export const loader = defineHandler(async (c) => {
  c.header('Cache-Control', 'private, no-store');
  await requireAdmin(c.req.raw.headers);
  return { posts: await listAdminPosts() };
});
export type Props = InferProps<typeof loader>;
export const actions = {
  create: defineHandler(async (c) => {
    c.header('Cache-Control', 'private, no-store');
    await requireAdmin(c.req.raw.headers);
    const post = await createPost();
    return c.redirect(`/studio/posts/upsert/${encodeURIComponent(post.id)}`, 303);
  }),
  delete: defineHandler.withValidator({ body: z.object({ id: z.string().min(1) }) })(
    async (c, { body }) => {
      c.header('Cache-Control', 'private, no-store');
      await requireAdmin(c.req.raw.headers);
      await deletePost(body.id);
    },
  ),
};
