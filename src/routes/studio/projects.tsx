import { createFileRoute } from '@tanstack/react-router';

import { AdminContainer } from '~/components/admin/admin-container';

export const Route = createFileRoute('/studio/projects')({
  component: StudioProjectsPage,
});

function StudioProjectsPage() {
  return <AdminContainer>projects</AdminContainer>;
}
