import { defineHandler } from 'void';

import { requireAdmin } from '~/lib/auth-guards';
export const loader = defineHandler(async (c) => {
  c.header('Cache-Control', 'private, no-store');
  await requireAdmin(c.req.raw.headers);
  return c.redirect('/studio/posts', 307);
});
