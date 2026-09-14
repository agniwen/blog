import { useQuery } from '@tanstack/react-query';

import { getComments } from './actions';
import { CommentsInput } from './comments-input';
import { CommentsList } from './comments-list';
import { CommentsMask } from './comments-mask';

interface CommentsProps {
  id: string;
}

export function Comments(props: CommentsProps) {
  const { id } = props;
  const { data } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments({ data: id }),
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
