import { createFileRoute } from '@tanstack/react-router';
import { app } from '~/server';

function handle({ request }: { request: Request }) {
  return app.fetch(request);
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
      OPTIONS: handle,
      HEAD: handle,
    },
  },
});
