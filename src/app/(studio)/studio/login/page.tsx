import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { LoginForm } from '~/components/features/login-form';
import { auth } from '~/lib/auth';

async function LoginPageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.role === 'admin') {
    redirect('/studio');
  }
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

function LoginPageFallback() {
  return (
    <div className='flex min-h-svh items-center justify-center text-sm text-muted-foreground'>
      Loading login...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
