import { createFileRoute, Link } from '@tanstack/react-router';

import { Social } from '~/components/features/social';
import { MotionProvider } from '~/components/provider/motion-provider';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { ScrollArea } from '~/components/ui/scroll-area';
import { clientEnv } from '~/lib/env';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'akumanoko' }, { name: 'description', content: 'akumanoko' }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MotionProvider>
      <script
        src='https://cloud.umami.is/script.js'
        data-website-id='db54fa9c-6564-4c24-a997-058b8012f7b7'
      />
      <ScrollArea className='h-screen'>
        <PageContainer className='home container mx-auto overflow-hidden'>
          <div className='flex min-h-screen w-full flex-col items-center justify-center space-y-8'>
            <div className='size-24 rounded-full bg-zinc-50'>
              <img
                src={clientEnv.NEXT_PUBLIC_AVATAR_URL}
                className='pointer-events-none w-full shrink-0 rounded-full object-contain shadow-xl'
                alt='avatar'
              />
            </div>
            <div className='flex flex-col items-center justify-center space-y-8'>
              <div className='text-center'>
                <h1 className='mb-4 text-xl text-gray-800'>Wen&apos;s Blog</h1>
                <p className='max-w-xs text-base text-balance text-gray-600'>
                  I am a Node.js developer. Currently, I don&apos;t have more to introduce about
                  myself.
                </p>
              </div>
              <Social />
              <Link to='/blog' preload='render'>
                <Button size='lg' variant='secondary' className='rounded-full px-8'>
                  Blog
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </ScrollArea>
    </MotionProvider>
  );
}
