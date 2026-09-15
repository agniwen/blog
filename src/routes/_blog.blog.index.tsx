import { Icon } from '@iconify/react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { PostList } from '~/components/features/blog/post-list';
import { BlogListSkeleton } from '~/components/features/page-skeletons';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { getPosts } from '~/server/functions';
export const Route = createFileRoute('/_blog/blog/')({
  loader: ({ context }) =>
    context.queryClient.query({ queryKey: ['post-list'], queryFn: () => getPosts() }),
  pendingComponent: BlogListSkeleton,
  component: Blogs,
});
function Blogs() {
  return (
    <PageContainer className='article-container pt-12 pb-8'>
      <div className='mb-8'>
        <Link to='/' aria-label='返回首页'>
          <Button size='icon-sm' variant='ghost' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <PostList />
    </PageContainer>
  );
}
