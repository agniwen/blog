import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginForm } from '~/components/features/login-form';
import { LoginSkeleton } from '~/components/features/page-skeletons';
import { getSession } from '~/server/functions';

export const Route = createFileRoute('/studio/login')({
  beforeLoad: async () => {
    if ((await getSession())?.user.role === 'admin')
      throw redirect({ to: '/studio', headers: { 'Cache-Control': 'private, no-store' } });
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  pendingComponent: LoginSkeleton,
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className='flex min-h-svh flex-col gap-4 p-6 md:p-10'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='mx-auto w-full max-w-xs'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
