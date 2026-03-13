import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';

import { requireAdmin } from '~/lib/route-guards';

import { StudioShell } from './-components/studio-shell';

export const Route = createFileRoute('/studio')({
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith('/studio/login')) {
      return;
    }
    await requireAdmin();
  },
  component: StudioLayout,
});

function StudioLayout() {
  const location = useLocation();

  if (location.pathname.startsWith('/studio/login')) {
    return <Outlet />;
  }

  return (
    <StudioShell>
      <Outlet />
    </StudioShell>
  );
}
