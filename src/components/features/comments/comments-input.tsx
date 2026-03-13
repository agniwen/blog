import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '~/components/ui/input-group';
import { Separator } from '~/components/ui/separator';
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const inputComment = comment;
    if (comment.trim().length === 0) {
      toast.info('请输入评论');
      setIsPending(false);
      return;
    }
    if (!data?.user) {
      toast.info('请登陆后评论');
      setComment('');
      setIsPending(false);
      return;
    }
    const create = {
      postId: id,
      content: inputComment,
    };
    try {
      await createComment(create);
      toast.success('评论成功');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    } catch (error) {
      console.error(error);
      toast.error('评论失败');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className='comment-input rounded-xl'>
      <div className='relative pt-4'>
        <form onSubmit={handleSubmit}>
          <InputGroup className='pt-2 [--radius:16px]'>
            <InputGroupTextarea
              name='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              placeholder='评论文章是免费的...'
            />
            <InputGroupAddon align='block-end'>
              <Separator className='flex-1 bg-transparent' orientation='vertical' />
              <InputGroupButton
                type='submit'
                disabled={isPending}
                variant='default'
                className='rounded-full'
                size='icon-sm'
              >
                <ArrowUpIcon className='size-5' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
