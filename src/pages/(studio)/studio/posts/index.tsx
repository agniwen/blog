import { AdminContainer } from '~/components/features/studio/admin-container';
import { Posts } from '~/components/features/studio/posts';
import { PostsCreateButton } from '~/components/features/studio/posts-create-button';
import { PostsRefreshButton } from '~/components/features/studio/posts-refresh-button';

import type { Props } from './index.server';

export default function PostsPage({ posts }: Props) {
  return (
    <AdminContainer className='space-y-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <PostsCreateButton />
        <PostsRefreshButton />
      </div>
      <Posts posts={posts} />
    </AdminContainer>
  );
}
