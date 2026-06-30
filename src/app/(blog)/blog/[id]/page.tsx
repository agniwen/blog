import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

import { Comments } from '~/components/features/comments';
import { HydrationBoundary } from '~/components/features/hydration-boundary';
import { CommentsLoader, PostContentLoader } from '~/components/features/post-loader';
import { PageContainer } from '~/components/ui/page-container';

import { PostHeader } from './_components/post-header';
import { getPost, getPosts } from './actions';
import { PostContent } from './content';

import '~/components/features/editor/simple-editor.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  'use cache';
  cacheLife({ revalidate: 300 });
  const { id } = await params;
  const data = await getPost(id);

  return {
    title: data?.title,
    description: data?.description,
  } as Metadata;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function Blog({ params }: { params: Promise<{ id: string }> }) {
  'use cache';
  cacheLife({ revalidate: 300 });
  const { id } = await params;
  return (
    <PageContainer className='mx-auto max-w-2xl px-4 pt-12'>
      <PostHeader />
      <Suspense fallback={<PostContentLoader />}>
        <HydrationBoundary
          prefetch={[
            {
              queryKey: ['post-detail', id],
              queryFn() {
                return getPost(id);
              },
            },
          ]}
        >
          <PostContent id={id} />
        </HydrationBoundary>
      </Suspense>
      <Suspense fallback={<CommentsLoader />}>
        <Comments id={id} />
      </Suspense>
    </PageContainer>
  );
}
