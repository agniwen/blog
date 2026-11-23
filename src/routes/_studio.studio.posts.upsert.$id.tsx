import { createFileRoute, notFound } from '@tanstack/react-router';

import { EditorSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import { UpsertEditor } from '~/components/features/studio/upsert-editor';
import { getAdminPost } from '~/server/functions';

export const Route = createFileRoute('/_studio/studio/posts/upsert/$id')({
  pendingMs: 0,
  loader: async ({ context, params }) => {
    const result = await context.queryClient.query({
      queryKey: ['admin-post-detail', params.id],
      queryFn: () => getAdminPost({ data: params.id }),
    });
    if (!result.data) throw notFound();
  },
  pendingComponent: () => (
    <AdminContainer flush className='h-full'>
      <EditorSkeleton />
    </AdminContainer>
  ),
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  return (
    <AdminContainer flush className='h-full'>
      <UpsertEditor key={id} id={id} />
    </AdminContainer>
  );
}
