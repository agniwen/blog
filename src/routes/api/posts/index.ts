import { defineHandler } from 'void';

import { success } from '~/lib/result';
import { createPost, listAdminPosts, updatePost } from '~/routes/api/posts/_data';
import { postsCreateSchema, postsUpdateSchema } from '~/routes/api/posts/_schema';

export const GET = defineHandler(async () => success(await listAdminPosts()));
export const POST = defineHandler.withValidator({ body: postsCreateSchema })(async (_c, { body }) =>
  success(await createPost(body)),
);
export const PUT = defineHandler.withValidator({ body: postsUpdateSchema })(
  async (_c, { body: { id, ...data } }) => success(await updatePost(id, data)),
);
