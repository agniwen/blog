import {
  IconArrowBackUp,
  IconExternalLink,
  IconRefresh,
  IconSend,
  IconTrash,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { useMemo, useState } from 'react';

import { CommentsAdminSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import {
  StudioFilterBar,
  StudioPageHeader,
  StudioSearchInput,
  StudioSegmentedFilter,
} from '~/components/features/studio/studio-filter-bar';
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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { TimeDisplay } from '~/components/ui/time-display';
import { toastManager } from '~/components/ui/toast';
import { hono } from '~/lib/hono';

type AuthorFilter = 'all' | 'reader' | 'admin';
type CommentSortOrder = 'newest' | 'oldest';

export const Route = createFileRoute('/_studio/studio/comments')({
  pendingComponent: () => (
    <AdminContainer className='space-y-6'>
      <CommentsAdminSkeleton />
    </AdminContainer>
  ),
  component: StudioCommentsPage,
});

function StudioCommentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>('all');
  const [sortOrder, setSortOrder] = useState<CommentSortOrder>('newest');

  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: () => parseResponse(hono.api.comments.$get()),
  });

  const allComments = data?.data ?? [];

  const filteredComments = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return allComments
      .filter((item) => {
        if (authorFilter === 'admin' && item.user?.role !== 'admin') return false;
        if (authorFilter === 'reader' && item.user?.role === 'admin') return false;
        if (keyword) {
          const haystack = [item.content, item.user?.name, item.user?.email, item.post?.title]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortOrder === 'oldest' ? -diff : diff;
      });
  }, [allComments, search, authorFilter, sortOrder]);

  const hasActiveFilters =
    search.trim().length > 0 || authorFilter !== 'all' || sortOrder !== 'newest';

  function handleResetFilters() {
    setSearch('');
    setAuthorFilter('all');
    setSortOrder('newest');
  }

  async function handleReplySubmit(postId: string, parentId: string) {
    const content = replyContent.trim();
    if (!content || isReplying) return;
    setIsReplying(true);
    try {
      await parseResponse(
        hono.api.comments.reply.$post({
          json: { postId, parentId, content },
        }),
      );
      setReplyingId(null);
      setReplyContent('');
      toastManager.add({ type: 'success', title: '回复已发送' });
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch {
      toastManager.add({ type: 'error', title: '发送回复失败' });
    } finally {
      setIsReplying(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      await parseResponse(hono.api.comments[':id'].$delete({ param: { id: deleteId } }));
      setDeleteId(null);
      toastManager.add({ type: 'success', title: '评论已删除' });
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch {
      toastManager.add({ type: 'error', title: '删除评论失败' });
    } finally {
      setIsDeleting(false);
    }
  }

  const sortItems = [
    { value: 'newest', label: '最新发表' },
    { value: 'oldest', label: '最早发表' },
  ];

  const countMeta = data
    ? hasActiveFilters
      ? `显示 ${filteredComments.length} / ${allComments.length} 条`
      : `共 ${allComments.length} 条`
    : undefined;

  return (
    <AdminContainer className='space-y-6'>
      <StudioPageHeader
        title='评论管理'
        description='集中查看、快捷回复或删除读者评论'
        meta={countMeta}
      />

      <div className='space-y-4'>
        <StudioFilterBar
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          actions={
            <Button
              size='sm'
              variant='secondary'
              loading={isFetching && !isLoading}
              onClick={() => void refetch()}
            >
              <IconRefresh className='size-3.5' />
              刷新
            </Button>
          }
        >
          <StudioSearchInput
            value={search}
            onChange={setSearch}
            placeholder='搜索评论内容、用户或文章...'
          />
          <StudioSegmentedFilter
            value={authorFilter}
            onChange={setAuthorFilter}
            options={[
              { value: 'all', label: '全部' },
              { value: 'reader', label: '读者' },
              { value: 'admin', label: '博主' },
            ]}
          />
          <Select
            items={sortItems}
            value={sortOrder}
            onValueChange={(value) => setSortOrder((value as CommentSortOrder) ?? 'newest')}
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </StudioFilterBar>

        {isLoading && !data ? (
          <CommentsAdminSkeleton />
        ) : filteredComments.length === 0 ? (
          <div className='rounded-lg border border-dashed border-border py-14 text-center text-sm text-muted-foreground'>
            {allComments.length === 0 ? '暂无评论' : '没有符合当前筛选条件的评论'}
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className='space-y-3 rounded-lg border border-border bg-card/60 p-4'
              >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div className='flex items-center gap-2.5'>
                    <img
                      src={comment.user?.image || '/default-avatar.svg'}
                      alt='avatar'
                      className='size-8 rounded-full object-cover'
                    />
                    <div>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-sm font-medium text-foreground'>
                          {comment.user?.name || '匿名用户'}
                        </span>
                        {comment.user?.role === 'admin' ? (
                          <Badge variant='secondary' className='h-4 px-1.5 text-[10px]'>
                            博主
                          </Badge>
                        ) : null}
                        {comment.user?.banned ? (
                          <Badge variant='destructive' className='h-4 px-1.5 text-[10px]'>
                            已封禁
                          </Badge>
                        ) : null}
                      </div>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                        <TimeDisplay
                          value={comment.createdAt}
                          options={{ format: 'YYYY-MM-DD HH:mm' }}
                        />
                        {comment.post ? (
                          <a
                            href={`/blog/${comment.post.id}`}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-flex items-center gap-1 hover:text-foreground'
                          >
                            文章：{comment.post.title || '无标题'}
                            <IconExternalLink className='size-3' />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Button
                      type='button'
                      size='xs'
                      variant='ghost'
                      onClick={() => {
                        if (replyingId === comment.id) {
                          setReplyingId(null);
                        } else {
                          setReplyingId(comment.id);
                          setReplyContent('');
                        }
                      }}
                    >
                      <IconArrowBackUp className='size-3.5' />
                      回复
                    </Button>
                    <Button
                      type='button'
                      size='xs'
                      variant='ghost'
                      className='text-destructive hover:text-destructive'
                      onClick={() => setDeleteId(comment.id)}
                    >
                      <IconTrash className='size-3.5' />
                      删除
                    </Button>
                  </div>
                </div>

                <p className='text-sm leading-relaxed whitespace-pre-wrap text-foreground/90'>
                  {comment.content}
                </p>

                {replyingId === comment.id ? (
                  <div className='space-y-2 border-t border-border/60 pt-3'>
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`回复 @${comment.user?.name || '匿名用户'}...`}
                      rows={2}
                    />
                    <div className='flex justify-end gap-2'>
                      <Button
                        type='button'
                        size='xs'
                        variant='ghost'
                        onClick={() => setReplyingId(null)}
                      >
                        取消
                      </Button>
                      <Button
                        type='button'
                        size='xs'
                        loading={isReplying}
                        onClick={() => handleReplySubmit(comment.postId, comment.id)}
                      >
                        <IconSend className='size-3' />
                        发送回复
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteId(null);
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除评论？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后无法恢复，其下的子回复也会一并清除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant='ghost' />}>取消</AlertDialogClose>
            <Button variant='destructive' loading={isDeleting} onClick={handleConfirmDelete}>
              确认删除
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </AdminContainer>
  );
}
