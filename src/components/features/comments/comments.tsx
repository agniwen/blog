import { CommentsInput } from './comments-input';
import { CommentsList } from './comments-list';
import { CommentsMask } from './comments-mask';
import type { CommentWithUser } from './comments-type';
export function Comments({ id, comments }: { id: string; comments: CommentWithUser[] }) {
  return (
    <div className='comment w-full pb-24'>
      <CommentsList list={comments} />
      <CommentsMask>
        <CommentsInput id={id} />
      </CommentsMask>
    </div>
  );
}
