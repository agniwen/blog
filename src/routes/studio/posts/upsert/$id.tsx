import { createFileRoute } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';

import { UpsertEditor } from './-components/upsert-editor';

export const Route = createFileRoute('/studio/posts/upsert/$id')({
  component: StudioPostUpsertPage,
});

function StudioPostUpsertPage() {
  const { id } = Route.useParams();

  return (
    <AdminContainer className='h-full'>
      <UpsertEditor id={id} />
    </AdminContainer>
  );
}
