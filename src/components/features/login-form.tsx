import { Icon } from '@iconify/react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Field, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { toastManager } from '~/components/ui/toast';
import { authClient } from '~/lib/auth-client';
import { cn } from '~/lib/utils';

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  async function googleSignIn() {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: location.href,
      });
      if (result.error) throw new Error(result.error.message);
    } catch {
      toastManager.add({ type: 'error', title: 'Google 登录失败，请重试' });
    } finally {
      setIsSigningIn(false);
    }
  }
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    async onSubmit({ value }) {
      const res = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });
      if (res.data?.user) {
        await router.invalidate();
        await router.navigate({ to: '/studio' });
      } else {
        toastManager.add({ type: 'error', title: 'login failed' });
      }
    },
  });

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-medium'>Login to your account</h1>
          <p className='text-sm text-balance text-muted-foreground'>
            Enter your email below to login to your account
          </p>
        </div>
        <form.Field
          name='email'
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            );
          }}
        />
        <form.Field
          name='password'
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  type='password'
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            );
          }}
        />
        <Field>
          <form.Subscribe>
            {(state) => {
              return (
                <Button className='w-full' loading={state.isSubmitting} type='submit'>
                  {state.isSubmitting ? 'Loading...' : 'Login'}
                </Button>
              );
            }}
          </form.Subscribe>
        </Field>
        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <Separator className='flex-1' />
          <span>Or continue with</span>
          <Separator className='flex-1' />
        </div>
        <Field>
          <Button
            className='w-full'
            variant='secondary'
            type='button'
            loading={isSigningIn}
            onClick={googleSignIn}
          >
            <Icon className='mr-1 size-4.5' icon='logos:google-icon' />
            Login with Google
          </Button>
        </Field>
      </div>
    </form>
  );
}
