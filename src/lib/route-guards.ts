import { redirect } from '@tanstack/react-router';
import { getSessionServerFn } from '~/server-fns/auth';

export async function requireAdmin() {
  const session = await getSessionServerFn();
  if (session?.user.role !== 'admin') {
    throw redirect({ to: '/' });
  }
  return session;
}

export async function redirectAdminToStudio() {
  const session = await getSessionServerFn();
  if (session?.user.role === 'admin') {
    throw redirect({ to: '/studio' });
  }
}
