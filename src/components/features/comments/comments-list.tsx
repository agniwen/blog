import { useQueryClient } from '@tanstack/react-query';
import type { InferUserFromClient } from 'better-auth';
import dayjs from 'dayjs';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { TimeDisplay } from '~/components/ui/time-display';
import { toastManager } from '~/components/ui/toast';
import { deleteComment } from '~/lib/api';
import { authClient } from '~/lib/auth-client';
import { cn } from '~/lib/utils';

import type { CommentWithUser, ReplyTarget } from './comments-type';

interface CommentListProps {
  postId: string;
  list: Array<CommentWithUser>;
  onReply: (target: ReplyTarget) => void;
}

interface CommentThread {
  root: CommentWithUser;
  replies: Array<{ comment: CommentWithUser; replyToName?: string }>;
}

export function CommentsList({ postId, list, onReply }: CommentListProps) {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const threads = useMemo<CommentThread[]>(() => {
    const byId = new Map<string, CommentWithUser>();
    list.forEach((item) => byId.set(item.id, item));

    const rootMap = new Map<string, CommentThread>();
    const roots: CommentThread[] = [];

    for (const item of list) {
      if (!item.parentId || !byId.has(item.parentId)) {
        const thread: CommentThread = { root: item, replies: [] };
        rootMap.set(item.id, thread);
        roots.push(thread);
      }
    }

    for (const item of list) {
      if (!item.parentId || !byId.has(item.parentId)) continue;
      let cursor: CommentWithUser | undefined = byId.get(item.parentId);
      const visited = new Set<string>([item.id]);
      while (cursor?.parentId && byId.has(cursor.parentId) && !visited.has(cursor.parentId)) {
        visited.add(cursor.parentId);
        cursor = byId.get(cursor.parentId);
      }
      const rootId = cursor?.id;
      const thread = rootId ? rootMap.get(rootId) : undefined;
      if (thread) {
        const directParent = byId.get(item.parentId);
        const replyToName =
          directParent && directParent.id !== thread.root.id
            ? directParent.user?.name || '匿名用户'
            : undefined;
        thread.replies.push({ comment: item, replyToName });
      }
    }

    return roots;
  }, [list]);

  async function handleConfirmDelete() {
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteComment(deleteId);
      toastManager.add({ type: 'success', title: '评论已删除' });
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch {
      toastManager.add({ type: 'error', title: '删除评论失败' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={cn('comment-list my-12! w-full')}>
      {threads.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground/75'>
          还没有评论，来写下第一条吧
        </p>
      ) : (
        <div className='space-y-5'>
          {threads.map((thread, index) => (
            <div key={thread.root.id} className='space-y-3'>
              <CommentsListItem
                user={data?.user}
                index={index}
                comment={thread.root}
                rootId={thread.root.id}
                onReply={onReply}
                onDelete={(id) => setDeleteId(id)}
              />
              {thread.replies.length > 0 ? (
                <div className='ml-10 space-y-3 border-l border-border/60 pl-4'>
                  {thread.replies.map(({ comment: reply, replyToName }) => (
                    <CommentsListItem
                      key={reply.id}
                      user={data?.user}
                      comment={reply}
                      rootId={thread.root.id}
                      replyToName={replyToName}
                      onReply={onReply}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteId(null);
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>删除评论</AlertDialogTitle>
            <AlertDialogDescription>
              确认删除这条评论吗？该操作无法撤销，其下的回复也会一并移除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant='ghost' />}>取消</AlertDialogClose>
            <Button variant='destructive' loading={isDeleting} onClick={handleConfirmDelete}>
              删除
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}

function CommentsListItem({
  comment,
  index,
  user,
  rootId,
  replyToName,
  onReply,
  onDelete,
}: {
  comment: CommentWithUser;
  index?: number;
  user?: InferUserFromClient<any> & { role?: string | null };
  rootId: string;
  replyToName?: string;
  onReply: (target: ReplyTarget) => void;
  onDelete: (id: string) => void;
}) {
  const isSelfComment = comment.userId === user?.id;
  const isAuthor = comment.user?.role === 'admin';
  const canDelete = Boolean(user && (isSelfComment || user.role === 'admin'));
  const exactTime = dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss');

  return (
    <div
      className={cn('comment-list-item group/comment flex items-start gap-3', {
        'flex-row-reverse': isSelfComment,
      })}
    >
      <div className='shrink-0 pt-0.5'>
        <img
          className='size-8 rounded-full object-cover'
          src={comment.user?.image || '/default-avatar.svg'}
          alt='avatar'
        />
      </div>
      <div
        className={cn('min-w-0 max-w-[85%]', {
          'text-right': isSelfComment,
        })}
      >
        <div
          className={cn('flex flex-wrap items-center gap-1.5 pb-1', {
            'justify-end': isSelfComment,
          })}
        >
          <span className='text-sm font-medium text-foreground'>
            {comment.user?.name || '匿名用户'}
          </span>
          {isAuthor ? (
            <Badge variant='secondary' className='h-4 px-1.5 text-[10px] font-normal'>
              博主
            </Badge>
          ) : null}
          {typeof index === 'number' ? (
            <span className='text-[10px] text-muted-foreground/75'>#{index + 1}</span>
          ) : null}
          <span title={exactTime} className='text-[11px] text-muted-foreground/75'>
            <TimeDisplay value={comment.createdAt} options={{ relative: true }} />
          </span>
        </div>

        <p
          className={cn(
            'inline-block bg-secondary px-3 py-2 text-left text-sm leading-relaxed whitespace-pre-wrap break-words',
            isSelfComment ? 'rounded-t-xl rounded-bl-xl' : 'rounded-t-xl rounded-br-xl',
          )}
        >
          {replyToName ? (
            <span className='mr-1.5 text-xs font-medium text-muted-foreground'>
              @{replyToName}
            </span>
          ) : null}
          {comment.content}
        </p>

        {user ? (
          <div
            className={cn(
              'mt-1 flex items-center gap-2 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover/comment:opacity-100 focus-within:opacity-100',
              { 'justify-end': isSelfComment },
            )}
          >
            <button
              type='button'
              onClick={() =>
                onReply({
                  id: comment.id,
                  rootId,
                  userName: comment.user?.name || '匿名用户',
                })
              }
              className='inline-flex items-center gap-1 transition-colors hover:text-foreground'
            >
              <Icon icon='lucide:reply' className='size-3' />
              回复
            </button>
            {canDelete ? (
              <button
                type='button'
                onClick={() => onDelete(comment.id)}
                className='inline-flex items-center gap-1 transition-colors hover:text-destructive'
              >
                <Icon icon='lucide:trash-2' className='size-3' />
                删除
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
