import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { CheckIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TagsSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import {
  StudioFilterBar,
  StudioPageHeader,
  StudioSearchInput,
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
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { TimeDisplay } from '~/components/ui/time-display';
import { toastManager } from '~/components/ui/toast';
import { hono } from '~/lib/hono';

type TagSortOrder = 'created-desc' | 'posts-desc' | 'name-asc';

export const Route = createFileRoute('/_studio/studio/tags')({
  pendingComponent: () => (
    <AdminContainer className='space-y-6'>
      <TagsSkeleton />
    </AdminContainer>
  ),
  component: StudioTagsPage,
});

function StudioTagsPage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<TagSortOrder>('created-desc');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: () => parseResponse(hono.api.tags.$get()),
  });

  const tagsList = data?.data ?? [];

  const filteredTags = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return tagsList
      .filter((tag) => (!keyword ? true : tag.name.toLowerCase().includes(keyword)))
      .sort((a, b) => {
        if (sortOrder === 'posts-desc') return b.postCount - a.postCount;
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name, 'zh-CN');
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tagsList, search, sortOrder]);

  const hasActiveFilters = search.trim().length > 0 || sortOrder !== 'created-desc';

  function handleResetFilters() {
    setSearch('');
    setSortOrder('created-desc');
  }

  async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = newName.trim();
    if (!name || isCreating) return;
    setIsCreating(true);
    try {
      await parseResponse(hono.api.tags.$post({ json: { name } }));
      setNewName('');
      toastManager.add({ type: 'success', title: `已创建标签 #${name}` });
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: error instanceof Error ? error.message : '创建标签失败',
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSaveRename(id: string) {
    const name = editingName.trim();
    if (!name || isUpdating) return;
    setIsUpdating(true);
    try {
      await parseResponse(hono.api.tags[':id'].$put({ param: { id }, json: { name } }));
      setEditingId(null);
      toastManager.add({ type: 'success', title: '标签已重命名' });
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      void queryClient.invalidateQueries({ queryKey: ['post-list'] });
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: error instanceof Error ? error.message : '重命名失败',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await parseResponse(hono.api.tags[':id'].$delete({ param: { id: deleteTarget.id } }));
      toastManager.add({ type: 'success', title: `已删除标签 #${deleteTarget.name}` });
      setDeleteTarget(null);
      await refetch();
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch {
      toastManager.add({ type: 'error', title: '删除标签失败' });
    } finally {
      setIsDeleting(false);
    }
  }

  const sortItems = [
    { value: 'created-desc', label: '最新创建' },
    { value: 'posts-desc', label: '文章最多' },
    { value: 'name-asc', label: '按名称' },
  ];

  const countMeta = data
    ? hasActiveFilters
      ? `显示 ${filteredTags.length} / ${tagsList.length} 个`
      : `共 ${tagsList.length} 个`
    : undefined;

  return (
    <AdminContainer className='space-y-6'>
      <StudioPageHeader
        title='标签管理'
        description='创建、重命名或删除文章分类标签'
        meta={countMeta}
      />

      <div className='space-y-4'>
        <StudioFilterBar
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          actions={
            <form onSubmit={handleCreate} className='flex items-center gap-2'>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='输入新标签名称...'
                className='w-40 sm:w-44'
              />
              <Button size='sm' type='submit' loading={isCreating}>
                <PlusIcon className='size-3.5' />
                新建标签
              </Button>
            </form>
          }
        >
          <StudioSearchInput value={search} onChange={setSearch} placeholder='搜索标签名称...' />
          <Select
            items={sortItems}
            value={sortOrder}
            onValueChange={(value) => setSortOrder((value as TagSortOrder) ?? 'created-desc')}
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
          <TagsSkeleton />
        ) : filteredTags.length === 0 ? (
          <div className='rounded-lg border border-dashed border-border py-14 text-center text-sm text-muted-foreground'>
            {tagsList.length === 0 ? '暂无标签，在上方输入名称即可创建' : '没有符合当前筛选条件的标签'}
          </div>
        ) : (
          <div className='divide-y divide-border rounded-lg border border-border bg-card/60'>
            {filteredTags.map((tag) => {
              const isEditing = editingId === tag.id;
              return (
                <div
                  key={tag.id}
                  className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    {isEditing ? (
                      <div className='flex items-center gap-1.5'>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              void handleSaveRename(tag.id);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                          className='h-8 w-44 text-sm'
                        />
                        <Button
                          type='button'
                          size='icon-xs'
                          loading={isUpdating}
                          onClick={() => handleSaveRename(tag.id)}
                          aria-label='保存'
                        >
                          <CheckIcon className='size-3.5' />
                        </Button>
                        <Button
                          type='button'
                          size='icon-xs'
                          variant='ghost'
                          onClick={() => setEditingId(null)}
                          aria-label='取消'
                        >
                          <XIcon className='size-3.5' />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge variant='secondary'>#{tag.name}</Badge>
                        <span className='text-xs text-muted-foreground'>
                          {tag.postCount} 篇文章
                        </span>
                      </>
                    )}
                  </div>

                  <div className='flex items-center gap-3'>
                    <TimeDisplay
                      className='text-xs text-muted-foreground tabular-nums'
                      value={tag.createdAt}
                      options={{ format: 'YYYY-MM-DD' }}
                    />
                    {!isEditing ? (
                      <div className='flex items-center gap-1'>
                        <Button
                          type='button'
                          size='icon-xs'
                          variant='ghost'
                          aria-label='重命名'
                          onClick={() => {
                            setEditingId(tag.id);
                            setEditingName(tag.name);
                          }}
                        >
                          <PencilIcon className='size-3.5' />
                        </Button>
                        <Button
                          type='button'
                          size='icon-xs'
                          variant='ghost'
                          aria-label='删除标签'
                          className='text-destructive hover:text-destructive'
                          onClick={() => setDeleteTarget({ id: tag.id, name: tag.name })}
                        >
                          <Trash2Icon className='size-3.5' />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>删除标签 #{deleteTarget?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将从所有关联文章中移除该标签，文章本身不会被删除。
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
