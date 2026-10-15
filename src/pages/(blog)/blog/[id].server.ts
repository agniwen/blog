import { HTTPException } from 'hono/http-exception';
import { defineHandler, defineHead, type InferProps } from 'void';
import { z } from 'zod';

import { comments } from '~/db/schema';
import { getAuth } from '~/lib/auth';
import { db } from '~/lib/db';
import { listComments, readPublishedPost } from '~/routes/api/posts/_data';

export const loader = defineHandler(async (c) => {
  const post = await readPublishedPost(c.req.param('id')!);
  return { post, comments: await listComments(post.id) };
});
export type Props = InferProps<typeof loader>;
export const head = defineHead<Props>((_c, props) => ({
  title: props.post.title ?? 'akumanoko',
  meta: [{ name: 'description', content: props.post.description ?? 'akumanoko' }],
}));
export const action = defineHandler.withValidator({
  body: z.object({ content: z.string().trim().min(1).max(10000) }),
})(async (c, { body }) => {
  const session = await getAuth().api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(401, { message: 'Unauthorized' });
  const post = await readPublishedPost(c.req.param('id')!);
  await db().insert(comments).values({
    postId: post.id,
    content: body.content,
    createdAt: new Date(),
    userId: session.user.id,
  });
});
