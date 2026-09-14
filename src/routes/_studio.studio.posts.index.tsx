import { createFileRoute } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';
import { Posts } from '~/components/features/studio/posts';
import { PostsCreateButton } from '~/components/features/studio/posts-create-button';
import { PostsRefreshButton } from '~/components/features/studio/posts-refresh-button';

export const Route = createFileRoute('/_studio/studio/posts/')({ component: PostsPage });

function PostsPage() {
  return (
    <AdminContainer className='space-y-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <PostsCreateButton />
        <PostsRefreshButton />
      </div>
      <Posts />
    </AdminContainer>
  );
}
