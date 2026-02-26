import { createFileRoute, Link } from '@tanstack/react-router';
import { Social } from '~/components/features/social';
import { MotionProvider } from '~/components/provider/motion-provider';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';
import { ScrollArea } from '~/components/ui/scroll-area';
import { env } from '~/lib/env';

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
        <PageContainer className='home overflow-hidden container mx-auto'>
          <div className='min-h-screen flex flex-col w-full justify-center space-y-8 items-center'>
            <div className='size-24 rounded-full bg-zinc-50'>
              <img src={env.NEXT_PUBLIC_AVATAR_URL} className='w-full shadow-xl object-contain shrink-0 pointer-events-none rounded-full' alt='avatar' />
            </div>
            <div className='flex flex-col items-center justify-center space-y-8'>
              <div className='text-center'>
                <h1 className='text-xl mb-4 text-gray-800'>Wen&apos;s Blog</h1>
                <p className='text-base max-w-xs text-balance text-gray-600'>
                  I am a Node.js developer. Currently, I don&apos;t have more to introduce about myself.
                </p>
              </div>
              <Social />
              <Link to='/blog' preload='render'>
                <Button size='lg' variant='secondary' className='px-8 rounded-full'>Blog</Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </ScrollArea>
    </MotionProvider>
  );
}
