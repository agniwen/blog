import Link from 'next/link';

import { Social } from '~/components/features/social';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { env } from '~/lib/env';

export const dynamic = 'force-static';

export default function Home() {
  return (
    <PageContainer className='home container mx-auto overflow-hidden'>
      <div className='flex min-h-screen w-full flex-col items-center justify-center space-y-8'>
        <div className='size-24 rounded-full bg-zinc-50'>
          <img
            src={env.NEXT_PUBLIC_AVATAR_URL}
            className='pointer-events-none w-full shrink-0 rounded-full object-contain shadow-xl'
            alt='avatar'
          />
        </div>
        <div className='flex flex-col items-center justify-center space-y-6'>
          <div className='text-center'>
            <h1 className='mb-4 text-xl text-gray-800'>Wen&apos;s Blog</h1>
            <p className='max-w-xs text-base text-balance text-gray-600'>
              I am a Node.js developer. Currently, I don&apos;t have more to introduce about myself.
            </p>
          </div>
          <Social />
          <Link href='/blog'>
            <Button variant='secondary' className='px-8'>
              Blog
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
