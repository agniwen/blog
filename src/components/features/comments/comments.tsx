import { useQuery } from '@tanstack/react-query';

import { CommentsLoader } from '~/components/features/post-loader';
import { useDelayedPending } from '~/hooks/use-delayed-pending';

import { getComments } from './actions';
import { CommentsInput } from './comments-input';
import { CommentsList } from './comments-list';
import { CommentsMask } from './comments-mask';

interface CommentsProps {
  id: string;
}

export function Comments(props: CommentsProps) {
  const { id } = props;
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
        <CommentsList list={data || []} />
      )}
      <CommentsMask>
        <CommentsInput id={id} />
      </CommentsMask>
    </div>
  );
}
