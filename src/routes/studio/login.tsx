import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '~/components/features/login-form';
import { redirectAdminToStudio } from '~/lib/route-guards';

export const Route = createFileRoute('/studio/login')({
  beforeLoad: async () => {
    await redirectAdminToStudio();
  },
  component: StudioLoginPage,
});

function StudioLoginPage() {
  return (
    <div className='flex flex-col min-h-svh gap-4 p-6 md:p-10'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='w-full max-w-xs mx-auto'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
