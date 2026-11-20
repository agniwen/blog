import { createFileRoute } from '@tanstack/react-router';

import { PostList } from '~/components/features/blog/post-list';
import { HomeSkeleton } from '~/components/features/page-skeletons';
import { Social } from '~/components/features/social';
import { PageContainer } from '~/components/ui/page-container';
import { clientEnv } from '~/lib/client-env';
import { getPosts } from '~/server/functions';

export const Route = createFileRoute('/_blog/')({
  loader: ({ context }) =>
    context.queryClient.query({ queryKey: ['post-list'], queryFn: () => getPosts() }),
  pendingComponent: HomeSkeleton,
  component: Home,
});

function Home() {
  return (
    <PageContainer className='home mx-auto w-full max-w-[30rem] px-5 pt-24 pb-16 sm:pt-36 sm:pb-24'>
      <header className='flex flex-col items-center text-center'>
        <div className='home-avatar size-18'>
          <img
            src={clientEnv.NEXT_PUBLIC_AVATAR_URL}
            className='pointer-events-none size-full shrink-0 rounded-full object-contain'
            alt='avatar'
          />
        </div>
        <h1 className='mt-5 text-xl font-medium tracking-tight text-foreground'>Wen&apos;s Blog</h1>
        <p className='mt-2 max-w-xs text-sm leading-relaxed text-balance text-muted-foreground'>
          总有一天，我会在这里写下些什么...
        </p>
        <Social className='mt-5' />
      </header>
      <section aria-label='文章列表' className='mt-10 sm:mt-12'>
        <PostList />
      </section>
    </PageContainer>
  );
}
