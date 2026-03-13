import { createFileRoute } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';

import { Posts } from './-components/posts';
import { PostsCreateButton } from './-components/posts-create-button';
import { PostsRefreshButton } from './-components/posts-refresh-button';

export const Route = createFileRoute('/studio/posts/')({
  component: StudioPostsPage,
});

function StudioPostsPage() {
  return (
    <AdminContainer className='space-y-4'>
      <div className='flex gap-4'>
        <PostsCreateButton />
        <PostsRefreshButton />
      </div>
      <Posts />
    </AdminContainer>
  );
}
