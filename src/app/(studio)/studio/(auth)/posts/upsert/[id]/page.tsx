import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

import { AdminContainer } from '~/components/admin/admin-container';
import { db } from '~/lib/db';
import { success } from '~/lib/result';

import { UpsertEditor, UpsertEditorSkeleton } from '../_components/upsert-editor';

interface PostEditProps {
  params: Promise<{ id: string }>;
}

async function getInitialData(id: string) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['post-detail', id],
    async queryFn() {
      const data = await db().query.posts.findFirst({
        where: {
          id,
          published: true,
        },
      });
      return success(data);
    },
  });
  return dehydrate(queryClient);
}

async function PostEditContent({ params }: PostEditProps) {
  const { id } = await params;
  const state = await getInitialData(id);
  return (
    <HydrationBoundary state={state}>
      <AdminContainer className='h-full'>
        <UpsertEditor id={id} />
      </AdminContainer>
    </HydrationBoundary>
  );
}

export default function PostEdit(props: PostEditProps) {
  return (
    <Suspense
      fallback={
        <AdminContainer className='h-full'>
          <UpsertEditorSkeleton />
        </AdminContainer>
      }
    >
      <PostEditContent {...props} />
    </Suspense>
  );
}
