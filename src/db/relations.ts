import { defineRelations } from 'drizzle-orm';

import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
  users: {
    accounts: r.many.accounts(),
    comments: r.many.comments(),
    sessions: r.many.sessions(),
  },
  comments: {
    user: r.one.users({
      from: r.comments.userId,
      to: r.users.id,
    }),
    post: r.one.posts({
      from: r.comments.postId,
      to: r.posts.id,
    }),
  },
  posts: {
    tags: r.many.tags({
      from: r.posts.id.through(r.postTags.postId),
      to: r.tags.id.through(r.postTags.tagId),
    }),
    comments: r.many.comments(),
  },
  tags: {
    posts: r.many.posts(),
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
}));
