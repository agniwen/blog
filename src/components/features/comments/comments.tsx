import type { CommentWithUser } from './comments-type';
import { useQuery } from '@tanstack/react-query';
import { getComments } from './actions';
import { CommentsInput } from './comments-input';
import { CommentsList } from './comments-list';
import { CommentsMask } from './comments-mask';

interface CommentsProps {
  id: string
  initialComments: Array<CommentWithUser>
}

export function Comments(props: CommentsProps) {
  const { id, initialComments } = props;
  const { data } = useQuery({
    queryKey: ['comments', id],
    initialData: initialComments,
    queryFn() {
      return getComments(id);
    },
  });

  return (
    <div className='comment w-full pb-24'>
      <CommentsList list={data || []} />
      <CommentsMask>
        <CommentsInput id={id} />
      </CommentsMask>
    </div>
  );
}
