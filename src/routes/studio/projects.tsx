import { createFileRoute } from '@tanstack/react-router';
import { AdminContainer } from '~/components/admin/admin-container';
import { requireAdmin } from '~/lib/route-guards';
import { StudioShell } from './-components/studio-shell';

export const Route = createFileRoute('/studio/projects')({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: StudioProjectsPage,
});

function StudioProjectsPage() {
  return (
    <StudioShell>
      <AdminContainer>projects</AdminContainer>
    </StudioShell>
  );
}
