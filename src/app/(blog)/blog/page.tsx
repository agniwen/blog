import { Icon } from '@iconify/react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Suspense } from 'react';

import { HydrationBoundary } from '~/components/features/hydration-boundary';
import { PostListLoader } from '~/components/features/post-loader';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';

import { getPosts } from './[id]/actions';
import { PostList } from './_components/post-list';

export default async function Blogs() {
  'use cache';
  cacheLife({ revalidate: 300 });
  return (
    <PageContainer className='mx-auto max-w-2xl pt-12 pb-8'>
      <div className='mb-8 px-4'>
        <Link href='/'>
          <Button size='icon-sm' variant='secondary' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <Suspense fallback={<PostListLoader />}>
        <HydrationBoundary
          prefetch={[
            {
              queryKey: ['post-list'],
              queryFn() {
                return getPosts();
              },
            },
          ]}
        >
          <PostList />
        </HydrationBoundary>
      </Suspense>
    </PageContainer>
  );
}
