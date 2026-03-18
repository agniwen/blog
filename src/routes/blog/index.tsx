import { Icon } from '@iconify/react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { PostListLoader } from '~/components/features/post-loader/post-loader';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { getPublishedPostsServerFn } from '~/server-fns/posts';

import { PostList } from './-components/post-list';

export const Route = createFileRoute('/blog/')({
  pendingComponent: BlogListPendingPage,
  pendingMs: 0,
  loader: async () => {
    const posts = await getPublishedPostsServerFn();
    return { posts };
  },
  headers: () => ({
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
  }),
  component: BlogListPage,
});

function BlogListPage() {
  const { posts } = Route.useLoaderData();

  return (
    <PageContainer className='mx-auto max-w-2xl pt-12 pb-8'>
      <div className='mb-8 px-4'>
        <Link to='/'>
          <Button size='icon-sm' variant='secondary' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <PostList posts={posts} />
    </PageContainer>
  );
}

function BlogListPendingPage() {
  return (
    <PageContainer className='mx-auto max-w-2xl pt-12 pb-8'>
      <div className='mb-8 px-4'>
        <Link to='/'>
          <Button size='icon-sm' variant='secondary' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <PostListLoader />
    </PageContainer>
  );
}
