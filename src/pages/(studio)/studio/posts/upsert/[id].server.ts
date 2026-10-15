import { defineHandler, type InferProps } from 'void';

import { requireAdmin } from '~/lib/auth-guards';
import { readAdminPost, updatePost } from '~/routes/api/posts/_data';
import { postsCreateSchema } from '~/routes/api/posts/_schema';

export const loader = defineHandler(async (c) => {
  c.header('Cache-Control', 'private, no-store');
  await requireAdmin(c.req.raw.headers);
  const post = await readAdminPost(c.req.param('id')!);
  return { post };
});
export type Props = InferProps<typeof loader>;
export const action = defineHandler.withValidator({ body: postsCreateSchema })(async (
  c,
  { body },
) => {
  c.header('Cache-Control', 'private, no-store');
  await requireAdmin(c.req.raw.headers);
  await updatePost(c.req.param('id')!, body);
});
