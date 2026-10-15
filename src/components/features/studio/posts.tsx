import { Link, action } from '@void/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

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
import { cn } from '~/lib/utils';
import type { Props } from '~/pages/(studio)/studio/posts/index.server';

export function Posts({ posts }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  async function handleDelete(postId: string) {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await action('/studio/posts?delete', {
        data: { id: postId },
        method: 'DELETE',
      });
      if (!result.ok) throw new Error(result.error.message);
      toastManager.add({ type: 'success', title: 'Post deleted' });
      setConfirmDialogOpen(false);
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

  return (
    <>
      <div className='posts pb-4'>
        <div className={cn('grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4')}>
          {posts.map((post) => {
            return (
              <ContextMenu key={post.id}>
                <ContextMenuTrigger
                  render={
                    <Link
                      href={`/studio/posts/upsert/${encodeURIComponent(post.id)}`}
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
