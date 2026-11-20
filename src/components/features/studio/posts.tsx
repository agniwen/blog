import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { PostsSkeleton } from '~/components/features/page-skeletons';
import { PostCard } from '~/components/features/post-card';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import {
  ContextMenu,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { toastManager } from '~/components/ui/toast';
import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { hono } from '~/lib/hono';
import { cn } from '~/lib/utils';

export function Posts() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
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

  const showSkeleton = useDelayedPending(isLoading && !posts);

  async function handleDelete(postId: string) {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await parseResponse(
        hono.api.posts[':id'].$delete({
          param: {
            id: postId,
          },
        }),
      );
      if (res.data.id) {
        toastManager.add({ type: 'success', title: 'Post deleted' });
        setConfirmDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete post', error);
      toastManager.add({ type: 'error', title: 'Failed to delete post' });
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSelectDeletePost(id: string) {
    setDeletePostId(id);
    setConfirmDialogOpen(true);
  }

  if ((isLoading && !posts) || showSkeleton) {
    return showSkeleton ? <PostsSkeleton /> : null;
  }

  return (
    <>
      <div className='posts pb-4'>
        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4',
            isFetching && 'opacity-80',
          )}
        >
          {posts?.data.map((post) => {
            return (
              <ContextMenu key={post.id}>
                <ContextMenuTrigger
                  render={
                    <Link
                      to='/studio/posts/upsert/$id'
                      params={{ id: post.id }}
                      className='block min-w-0'
                    >
                      <PostCard className='h-full' post={post} />
                    </Link>
                  }
                />
                <ContextMenuPopup>
                  <ContextMenuItem onClick={() => handleSelectDeletePost(post.id)}>
                    <Trash2Icon />
                    Delete
                  </ContextMenuItem>
                </ContextMenuPopup>
              </ContextMenu>
            );
          })}
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant='ghost' />}>Cancel</AlertDialogClose>
            <Button
              variant='destructive'
              loading={isDeleting}
              onClick={() => deletePostId && handleDelete(deletePostId)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
