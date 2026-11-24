import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '~/components/ui/input-group';
import { Separator } from '~/components/ui/separator';
import { toastManager } from '~/components/ui/toast';
import { createComment } from '~/lib/api';
import { authClient } from '~/lib/auth-client';

import type { ReplyTarget } from './comments-type';

interface CommentsInputProps {
  id: string;
  replyTo?: ReplyTarget | null;
  onCancelReply?: () => void;
}

export function CommentsInput({ id, replyTo, onCancelReply }: CommentsInputProps) {
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
      parentId: replyTo?.id,
    };
    try {
      await createComment(create);
      toastManager.add({ type: 'success', title: replyTo ? '回复成功' : '评论成功' });
      setComment('');
      onCancelReply?.();
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
      <div className='relative'>
        <h2 className='py-4 text-sm font-medium opacity-60 select-none'>评论</h2>
        {replyTo ? (
          <div className='mb-2 flex items-center justify-between rounded-lg border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground'>
            <span>
              正在回复 <span className='font-medium text-foreground'>@{replyTo.userName}</span>
            </span>
            <button
              type='button'
              onClick={onCancelReply}
              aria-label='取消回复'
              className='inline-flex items-center gap-1 transition-colors hover:text-foreground'
            >
              <Icon icon='lucide:x' className='size-3.5' />
              取消
            </button>
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <InputGroup className='rounded-lg'>
            <InputGroupTextarea
              name='comment'
              size={'sm'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              placeholder={replyTo ? `回复 @${replyTo.userName}...` : '评论文章是免费的...'}
            />
            <InputGroupAddon align='block-end'>
              <Separator className='flex-1 bg-transparent' orientation='vertical' />
              <Button
                size={'xs'}
                type='submit'
                aria-label='发送评论'
                loading={isPending}
                variant='default'
                shape='paper'
              >
                <Icon icon='lucide:arrow-up' className='size-4' />发 表
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
