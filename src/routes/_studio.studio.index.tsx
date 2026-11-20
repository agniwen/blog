import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_studio/studio/')({
  beforeLoad: () => {
    throw redirect({
      to: '/studio/posts',
      replace: true,
      headers: { 'Cache-Control': 'private, no-store' },
    });
  },
});
