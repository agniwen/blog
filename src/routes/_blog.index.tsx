import { createFileRoute, Link } from '@tanstack/react-router';

import { Social } from '~/components/features/social';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { clientEnv } from '~/lib/client-env';

export const Route = createFileRoute('/_blog/')({ component: Home });

function Home() {
  return (
    <PageContainer className='home container mx-auto overflow-hidden'>
      <div className='flex min-h-screen w-full flex-col items-center justify-center space-y-8'>
        <div className='size-24 rounded-full bg-muted'>
          <img
            src={clientEnv.NEXT_PUBLIC_AVATAR_URL}
            className='pointer-events-none w-full shrink-0 rounded-full object-contain shadow-sm ring-1 ring-border'
            alt='avatar'
          />
        </div>
        <div className='flex flex-col items-center justify-center space-y-6'>
          <div className='text-center'>
            <h1 className='mb-4 text-xl text-foreground'>Wen&apos;s Blog</h1>
            <p className='max-w-xs text-base text-balance text-muted-foreground'>
              总有一天，我会在这里写下些什么...
            </p>
          </div>
          <Social />
          <Button render={<Link to='/blog' />} variant='secondary' className='px-4'>
            Blog
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
