import { createFileRoute, redirect } from '@tanstack/react-router';
import { requireAdmin } from '~/lib/route-guards';

export const Route = createFileRoute('/studio/posts/upsert/')({
  beforeLoad: async () => {
    await requireAdmin();
    throw redirect({ to: '/studio/posts' });
  },
});
