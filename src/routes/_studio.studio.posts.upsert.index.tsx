import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_studio/studio/posts/upsert/')({
  beforeLoad: () => {
    throw redirect({ to: '/studio/posts' });
  },
});
