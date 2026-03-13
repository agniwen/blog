import type { InferUserFromClient } from 'better-auth';

import { TimeDisplay } from '~/components/ui/time-display';
import { authClient } from '~/lib/auth-client';
import { cn } from '~/lib/utils';

import type { CommentWithUser } from './comments-type';

interface CommentListProps {
  list: Array<CommentWithUser>;
}

export function CommentsList({ list }: CommentListProps) {
  const { data } = authClient.useSession();
  return (
    <div className={cn('comment-list my-12! w-full')}>
      <div>
        {list.map((comment, index) => {
          return (
            <CommentsListItem user={data?.user} index={index} key={comment.id} comment={comment} />
          );
        })}
      </div>
    </div>
  );
}

function CommentsListItem({
  comment,
  index,
  user,
}: {
  comment: CommentWithUser;
  index: number;
  user?: InferUserFromClient<any>;
}) {
  const isSelfComment = comment.userId === user?.id;

  return (
    <div
      className={cn('comment-list-item mb-4! flex items-end gap-4', {
        'flex-row-reverse': isSelfComment,
      })}
    >
      <div className='shrink-0'>
        <img
          className='size-8 rounded-full'
          src={comment.user?.image || '/default-avatar.svg'}
          alt='avatar'
        />
      </div>
      <div
        className={cn({
          'text-right': isSelfComment,
        })}
      >
        <div className='space-x-2 pb-1 pl-1'>
          <span className='text-sm font-bold'>{comment.user?.name}</span>
          <span className='text-[10px] text-gray-500'>
            #{index + 1}{' '}
            <TimeDisplay value={comment.createdAt} options={{ format: 'YYYY-MM-DD HH:mm:ss' }} />
          </span>
          <TimeDisplay
            className='text-[10px] text-gray-500'
            value={comment.createdAt}
            options={{ relative: true }}
          />
        </div>
        <p
          className={cn('inline-block bg-gray-100 p-2 text-left text-sm', [
            isSelfComment ? 'rounded-t-xl rounded-bl-xl' : 'rounded-t-xl rounded-br-xl',
          ])}
        >
          {comment.content}
        </p>
      </div>
    </div>
  );
}
