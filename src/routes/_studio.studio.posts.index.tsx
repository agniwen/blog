import { createFileRoute } from '@tanstack/react-router';

import { PostsSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import { Posts } from '~/components/features/studio/posts';
import { StudioPageHeader } from '~/components/features/studio/studio-filter-bar';
import { Skeleton } from '~/components/ui/skeleton';

export const Route = createFileRoute('/_studio/studio/posts/')({
  pendingComponent: () => (
    <AdminContainer className='space-y-6'>
      <div className='space-y-1.5'>
        <Skeleton className='h-6 w-20 rounded-sm' />
        <Skeleton className='h-3.5 w-44 rounded-sm' />
      </div>
      <PostsSkeleton />
    </AdminContainer>
  ),
  component: PostsPage,
});

function PostsPage() {
  return (
    <AdminContainer className='space-y-6'>
      <StudioPageHeader title='文章管理' description='创建、编辑与发布博客文章' />
      <Posts />
    </AdminContainer>
  );
}
