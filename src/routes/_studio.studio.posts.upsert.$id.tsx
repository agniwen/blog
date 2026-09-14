import { createFileRoute, notFound } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';
import { UpsertEditor } from '~/components/features/studio/upsert-editor';
import { getAdminPost } from '~/server/functions';

export const Route = createFileRoute('/_studio/studio/posts/upsert/$id')({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.query({
      queryKey: ['admin-post-detail', params.id],
      queryFn: () => getAdminPost({ data: params.id }),
    });
    if (!result.data) throw notFound();
  },
  component: () => (
    <AdminContainer flush className='h-full'>
      <UpsertEditor id={Route.useParams().id} />
    </AdminContainer>
  ),
});
