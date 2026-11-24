import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { PostList } from '~/components/features/blog/post-list';
import { HomeSkeleton } from '~/components/features/page-skeletons';
import { Social } from '~/components/features/social';
import { PageContainer } from '~/components/ui/page-container';
import { clientEnv } from '~/lib/client-env';
import {
  buildHomeOgUrl,
  getSiteOrigin,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '~/lib/site-meta';
import { fetchPublicPosts } from '~/lib/api';

export const Route = createFileRoute('/_blog/')({
  validateSearch: z.object({
    tag: z.string().optional(),
  }),
  loader: ({ context }) =>
    context.queryClient.query({ queryKey: ['post-list'], queryFn: () => fetchPublicPosts() }),
  head: () => {
    const origin = getSiteOrigin();
    const ogImage = buildHomeOgUrl(origin);
    return {
      meta: [
        { title: SITE_TITLE },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: `${origin}/` },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
        { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: `${origin}/` }],
    };
  },
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
