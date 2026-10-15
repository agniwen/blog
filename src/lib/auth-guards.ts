import { HTTPException } from 'hono/http-exception';

import { getAuth } from './auth';

export async function requireAdmin(headers: Headers) {
  const session = await getAuth().api.getSession({ headers });
  if (session?.user.role !== 'admin') throw new HTTPException(401, { message: 'Unauthorized' });
  return session;
}
