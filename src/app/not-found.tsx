import Link from 'next/link';

import { Button } from '~/components/ui/button';

export default function NotFound() {
  return (
    <div className='mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <p className='text-4xl font-bold tracking-[0.4em] text-muted-foreground uppercase'>404</p>
        <h1 className='text-3xl font-semibold text-foreground'>Page not found</h1>
        <p className='text-sm text-muted-foreground'>
          The page you requested does not exist or has moved.
        </p>
        <Link href='/'>
          <Button variant='secondary' className='rounded-full px-6'>
            Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
