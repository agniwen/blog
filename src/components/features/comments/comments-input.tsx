import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '~/components/ui/input-group';
import { Separator } from '~/components/ui/separator';
import { toastManager } from '~/components/ui/toast';
import { authClient } from '~/lib/auth-client';

import { createComment } from './actions';

interface CommentsInputProps {
  id: string;
}
export function CommentsInput({ id }: CommentsInputProps) {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const inputComment = comment;
    if (comment.trim().length === 0) {
      toastManager.add({ type: 'info', title: '请输入评论' });
      setIsPending(false);
      return;
    }
    if (!data?.user) {
      toastManager.add({ type: 'info', title: '请登陆后评论' });
      setComment('');
      setIsPending(false);
      return;
    }
    const create = {
      postId: id,
      content: inputComment,
    };
    try {
      await createComment({ data: create });
      toastManager.add({ type: 'success', title: '评论成功' });
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    } catch (error) {
      console.error(error);
      toastManager.add({ type: 'error', title: '评论失败' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className='comment-input rounded-xl'>
      <div className='relative pt-4'>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroupTextarea
              name='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              placeholder='评论文章是免费的...'
            />
            <InputGroupAddon align='block-end'>
              <Separator className='flex-1 bg-transparent' orientation='vertical' />
              <Button
                type='submit'
                aria-label='发送评论'
                loading={isPending}
                variant='default'
                size='icon-sm'
              >
                <ArrowUpIcon className='size-5' />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
