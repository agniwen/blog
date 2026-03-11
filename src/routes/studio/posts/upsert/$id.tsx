import { createFileRoute } from '@tanstack/react-router';
import { AdminContainer } from '~/components/admin/admin-container';
import { requireAdmin } from '~/lib/route-guards';
import { StudioShell } from '../../-components/studio-shell';
import { UpsertEditor } from './-components/upsert-editor';

export const Route = createFileRoute('/studio/posts/upsert/$id')({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: StudioPostUpsertPage,
});

function StudioPostUpsertPage() {
  const { id } = Route.useParams();

  return (
    <StudioShell>
      <AdminContainer className='h-full'>
        <UpsertEditor id={id} />
      </AdminContainer>
    </StudioShell>
  );
}
