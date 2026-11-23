import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import {
  CopyIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { PostsSkeleton } from '~/components/features/page-skeletons';
import { PostCard } from '~/components/features/post-card';
import { PostsCreateButton } from '~/components/features/studio/posts-create-button';
import { PostsRefreshButton } from '~/components/features/studio/posts-refresh-button';
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
import { Button } from '~/components/ui/button';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuPopup,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toastManager } from '~/components/ui/toast';
import { hono } from '~/lib/hono';
import { cn } from '~/lib/utils';

type StatusFilter = 'all' | 'published' | 'draft';
type SortOrder = 'created-desc' | 'updated-desc';

export function Posts() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('created-desc');

  const {
    data: posts,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryFn() {
      return parseResponse(hono.api.posts.$get());
    },
    queryKey: ['posts'],
  });

  const { data: tagsRes } = useQuery({
    queryKey: ['tags'],
    queryFn: () => parseResponse(hono.api.tags.$get()),
  });

  const filteredPosts = useMemo(() => {
    const list = posts?.data ?? [];
    const keyword = search.trim().toLowerCase();
    return list
      .filter((post) => {
        if (statusFilter === 'published' && !post.published) return false;
        if (statusFilter === 'draft' && post.published) return false;
        if (tagFilter !== 'all' && !post.tags?.some((t) => t.id === tagFilter)) return false;
        if (keyword) {
          const haystack = [post.title, post.description, post.slug]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const key = sortOrder === 'updated-desc' ? 'updatedAt' : 'createdAt';
        return new Date(b[key]).getTime() - new Date(a[key]).getTime();
      });
  }, [posts?.data, search, statusFilter, tagFilter, sortOrder]);

  async function handleDelete(postId: string) {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await parseResponse(
        hono.api.posts[':id'].$delete({
          param: { id: postId },
        }),
      );
      if (res.data.id) {
        toastManager.add({ type: 'success', title: '文章已删除' });
        setConfirmDialogOpen(false);
        await refetch();
        void queryClient.invalidateQueries({ queryKey: ['post-list'] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }
    } catch (error) {
      console.error('Failed to delete post', error);
      toastManager.add({ type: 'error', title: '删除文章失败' });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleTogglePublish(postId: string, currentPublished: boolean | null) {
    const nextPublished = !currentPublished;
    try {
      await parseResponse(
        hono.api.posts.$put({
          json: {
            id: postId,
            published: nextPublished,
          },
        }),
      );
      toastManager.add({
        type: 'success',
        title: nextPublished ? '文章已发布' : '已转为草稿',
      });
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['post-list'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch {
      toastManager.add({ type: 'error', title: '更新发布状态失败' });
    }
  }

  async function handleCopyLink(postId: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${postId}`);
      toastManager.add({ type: 'success', title: '已复制文章链接' });
    } catch {
      toastManager.add({ type: 'error', title: '复制链接失败' });
    }
  }

  function handleSelectDeletePost(id: string) {
    setDeletePostId(id);
    setConfirmDialogOpen(true);
  }

  const totalCount = posts?.data.length ?? 0;
  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== 'all' ||
    tagFilter !== 'all' ||
    sortOrder !== 'created-desc';

  const countMeta = posts
    ? hasActiveFilters
      ? `显示 ${filteredPosts.length} / ${totalCount} 篇`
      : `共 ${totalCount} 篇`
    : undefined;

  if (isLoading && !posts) {
    return (
      <div className='space-y-6'>
        <StudioPageHeader title='文章管理' description='创建、编辑与发布博客文章' />
        <PostsSkeleton />
      </div>
    );
  }

  const tagItems = [
    { value: 'all', label: '全部标签' },
    ...(tagsRes?.data.map((t) => ({ value: t.id, label: `#${t.name}` })) ?? []),
  ];

  const sortItems = [
    { value: 'created-desc', label: '最新创建' },
    { value: 'updated-desc', label: '最近更新' },
  ];

  function handleResetFilters() {
    setSearch('');
    setStatusFilter('all');
    setTagFilter('all');
    setSortOrder('created-desc');
  }

  return (
    <>
      <div className='space-y-6 pb-4'>
        <StudioPageHeader
          title='文章管理'
          description='创建、编辑与发布博客文章'
          meta={countMeta}
        />

        <div className='space-y-4'>
          <StudioFilterBar
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
            actions={
              <>
                <PostsRefreshButton />
                <PostsCreateButton />
              </>
            }
          >
          <StudioSearchInput
            value={search}
            onChange={setSearch}
            placeholder='搜索标题、简介或 Slug...'
          />

          <StudioSegmentedFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: '全部' },
              { value: 'published', label: '已发布' },
              { value: 'draft', label: '草稿' },
            ]}
          />

          <Select
            items={tagItems}
            value={tagFilter}
            onValueChange={(value) => setTagFilter(value ?? 'all')}
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {tagItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>

          <Select
            items={sortItems}
            value={sortOrder}
            onValueChange={(value) => setSortOrder((value as SortOrder) ?? 'created-desc')}
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

        {filteredPosts.length === 0 ? (
          <div className='rounded-lg border border-dashed border-border py-14 text-center text-sm text-muted-foreground'>
            {posts?.data.length === 0
              ? '还没有任何文章，点击上方「新建文章」开始创作吧'
              : '没有符合当前筛选条件的文章'}
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4',
              isFetching && 'opacity-80',
            )}
          >
            {filteredPosts.map((post) => {
              return (
                <div key={post.id} className='group relative min-w-0'>
                  <ContextMenu>
                    <ContextMenuTrigger
                      render={
                        <Link
                          to='/studio/posts/upsert/$id'
                          params={{ id: post.id }}
                          className='block h-full min-w-0'
                        >
                          <PostCard className='h-full' post={post} />
                        </Link>
                      }
                    />
                    <ContextMenuPopup>
                      <ContextMenuItem
                        render={<Link to='/studio/posts/upsert/$id' params={{ id: post.id }} />}
                      >
                        <PencilIcon />
                        编辑文章
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleTogglePublish(post.id, post.published)}
                      >
                        {post.published ? <EyeOffIcon /> : <SendIcon />}
                        {post.published ? '转为草稿' : '立即发布'}
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleSelectDeletePost(post.id)}>
                        <Trash2Icon />
                        删除文章
                      </ContextMenuItem>
                    </ContextMenuPopup>
                  </ContextMenu>

                  <div className='absolute top-2 right-2 z-10'>
                    <Menu>
                      <MenuTrigger
                        render={
                          <Button
                            type='button'
                            size='icon-xs'
                            variant='secondary'
                            aria-label='文章操作'
                            className='bg-popover/85 opacity-90 shadow-xs backdrop-blur-xs transition-opacity group-hover:opacity-100 sm:opacity-0 sm:focus-visible:opacity-100'
                          />
                        }
                      >
                        <MoreHorizontalIcon className='size-3.5' />
                      </MenuTrigger>
                      <MenuPopup align='end' side='bottom' sideOffset={4} className='min-w-36 rounded-lg'>
                        <MenuItem
                          render={<Link to='/studio/posts/upsert/$id' params={{ id: post.id }} />}
                          className='text-sm'
                        >
                          <PencilIcon className='size-3.5' />
                          编辑文章
                        </MenuItem>
                        {post.published ? (
                          <MenuItem
                            render={
                              <a
                                href={`/blog/${post.id}`}
                                target='_blank'
                                rel='noreferrer'
                              />
                            }
                            className='text-sm'
                          >
                            <ExternalLinkIcon className='size-3.5' />
                            查看线上文章
                          </MenuItem>
                        ) : null}
                        <MenuItem
                          onClick={() => handleCopyLink(post.id)}
                          className='text-sm'
                        >
                          <CopyIcon className='size-3.5' />
                          复制链接
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleTogglePublish(post.id, post.published)}
                          className='text-sm'
                        >
                          {post.published ? (
                            <EyeOffIcon className='size-3.5' />
                          ) : (
                            <SendIcon className='size-3.5' />
                          )}
                          {post.published ? '转为草稿' : '立即发布'}
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          onClick={() => handleSelectDeletePost(post.id)}
                          className='text-sm text-destructive'
                        >
                          <Trash2Icon className='size-3.5' />
                          删除文章
                        </MenuItem>
                      </MenuPopup>
                    </Menu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setConfirmDialogOpen(open);
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除文章？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销，将永久删除该文章及其关联评论。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant='ghost' />}>取消</AlertDialogClose>
            <Button
              variant='destructive'
              loading={isDeleting}
              onClick={() => deletePostId && handleDelete(deletePostId)}
            >
              确认删除
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
