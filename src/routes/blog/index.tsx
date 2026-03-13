import { Icon } from '@iconify/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { getPublishedPostsServerFn } from '~/server-fns/posts';
import { PostList } from './-components/post-list';

export const Route = createFileRoute('/blog/')({
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
    <PageContainer className='pt-12 pb-8 max-w-2xl mx-auto'>
      <div className='px-4 mb-8'>
        <Link to='/'>
          <Button size='icon' variant='secondary' className='rounded-full text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <PostList posts={posts} />
    </PageContainer>
  );
}
