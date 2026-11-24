import type { comments, users } from '~/db/schema';

export type Comment = Omit<typeof comments.$inferSelect, 'createdAt'> & {
  createdAt: Date | string;
};
export type User = typeof users.$inferSelect;

export interface CommentWithUser extends Comment {
  user: Pick<User, 'id' | 'name' | 'image' | 'role'> | null;
}

export interface ReplyTarget {
  id: string;
  rootId: string;
  userName: string;
}
