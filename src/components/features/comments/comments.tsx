import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { CommentsLoader } from '~/components/features/post-loader';
import { useDelayedPending } from '~/hooks/use-delayed-pending';

import { getComments } from './actions';
import { CommentsInput } from './comments-input';
import { CommentsList } from './comments-list';
import { CommentsMask } from './comments-mask';
import type { ReplyTarget } from './comments-type';

interface CommentsProps {
  id: string;
}

/** 文章评论区容器，负责拉取评论列表、回复目标状态与延迟骨架屏切换。 */
export function Comments(props: CommentsProps) {
  const { id } = props;
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const { data, isPending } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments({ data: id }),
  });

  const showSkeleton = useDelayedPending(isPending && !data);

  return (
    <div className='comment w-full pb-24'>
      {showSkeleton ? (
        <div role='status' aria-label='正在加载评论'>
          <CommentsLoader />
        </div>
      ) : (
        <CommentsList postId={id} list={data || []} onReply={(target) => setReplyTo(target)} />
      )}
      <CommentsMask>
        <CommentsInput id={id} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      </CommentsMask>
    </div>
  );
}
