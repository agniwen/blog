import { defineHandler } from 'void';

import { db } from '~/lib/db';
import { success } from '~/lib/result';
import { deletePost } from '~/routes/api/posts/_data';
import { postsDetailSchema } from '~/routes/api/posts/_schema';

export const GET = defineHandler.withValidator({ params: postsDetailSchema })(
  async (_c, { params }) =>
    success(await db().query.posts.findFirst({ where: { id: params.id, published: true } })),
);
export const DELETE = defineHandler.withValidator({ params: postsDetailSchema })(
  async (_c, { params }) => success(await deletePost(params.id)),
);
