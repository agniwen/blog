import { LoginForm } from '~/components/features/login-form';

export default function LoginPage() {
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
