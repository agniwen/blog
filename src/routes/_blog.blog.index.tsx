import { Icon } from '@iconify/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import { PostList } from '~/components/features/blog/post-list';
import { PostListLoader } from '~/components/features/post-loader';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { getPosts } from '~/server/functions';
export const Route = createFileRoute('/_blog/blog/')({
  loader: ({ context }) =>
    context.queryClient.query({ queryKey: ['post-list'], queryFn: () => getPosts() }),
  component: Blogs,
});
function Blogs() {
  return (
    <PageContainer className='mx-auto max-w-2xl pt-12 pb-8'>
      <div className='mb-8 px-4'>
        <Link to='/' aria-label='返回首页'>
          <Button size='icon-sm' variant='secondary' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <Suspense fallback={<PostListLoader />}>
        <PostList />
      </Suspense>
    </PageContainer>
  );
}
