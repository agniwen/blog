import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_blog/blog/')({
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true, statusCode: 308 });
  },
});
