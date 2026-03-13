import { createCommentServerFn, getCommentsServerFn } from '~/server-fns/comments';

export async function getComments(postId: string) {
  return getCommentsServerFn({
    data: {
      postId,
    },
  });
}

export async function createComment(data: { postId: string; content: string }) {
  return createCommentServerFn({
    data,
  });
}
