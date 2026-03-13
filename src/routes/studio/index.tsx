import { createFileRoute } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';

import { UmamiDashboard } from './-components/umami-dashboard';

export const Route = createFileRoute('/studio/')({
  component: StudioDashboardPage,
});

function StudioDashboardPage() {
  return (
    <AdminContainer>
      <UmamiDashboard />
    </AdminContainer>
  );
}
