import { createFileRoute } from '@tanstack/react-router';
import { AdminContainer } from '~/components/admin/admin-container';
import { requireAdmin } from '~/lib/route-guards';
import { StudioShell } from './-components/studio-shell';
import { UmamiDashboard } from './-components/umami-dashboard';

export const Route = createFileRoute('/studio/')({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: StudioDashboardPage,
});

function StudioDashboardPage() {
  return (
    <StudioShell>
      <AdminContainer>
        <UmamiDashboard />
      </AdminContainer>
    </StudioShell>
  );
}
