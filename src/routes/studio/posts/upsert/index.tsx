import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/studio/posts/upsert/')({
  beforeLoad: async () => {
    throw redirect({ to: '/studio/posts' });
  },
});
