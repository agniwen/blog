import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { z } from 'zod';

import { HomeAsciiSky } from '~/components/features/blog/home-ascii-sky';
import { PostList } from '~/components/features/blog/post-list';
import { HomeSkeleton } from '~/components/features/page-skeletons';
import { PostListLoader } from '~/components/features/post-loader';
import { Social } from '~/components/features/social';
import { PageContainer } from '~/components/ui/page-container';
import { fetchPublicPosts } from '~/lib/api';
import { clientEnv } from '~/lib/client-env';
import {
  buildHomeOgUrl,
  getSiteOrigin,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '~/lib/site-meta';

export const Route = createFileRoute('/_blog/')({
  validateSearch: z.object({
    tag: z.string().optional(),
  }),
  // 列表在组件里用 Suspense 接上：文档先返回头像和 slogan，列表骨架随后被正文替换。
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery({
      queryKey: ['post-list'],
      queryFn: () => fetchPublicPosts(),
    });
  },
  headers: () => ({
    'Cache-Control': 'no-store',
  }),
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
    <div className='relative w-full overflow-x-clip'>
      <HomeAsciiSky />
      <PageContainer className='home relative z-10 mx-auto w-full max-w-[30rem] px-5 pt-24 pb-16 sm:pt-36 sm:pb-24'>
        <header className='flex flex-col items-start text-left'>
          <div className='home-avatar size-18'>
            <img
              src={clientEnv.NEXT_PUBLIC_AVATAR_URL}
              className='pointer-events-none size-full shrink-0 object-cover'
              alt='avatar'
            />
          </div>
          <h1 className='mt-5 text-xl font-medium tracking-tight text-foreground'>
            Hi, I&apos;m {SITE_TITLE}
          </h1>
          <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{SITE_DESCRIPTION}</p>
          <Social className='mt-2' />
        </header>
        <section aria-label='文章列表' className='mt-5 sm:mt-6'>
          <Suspense
            fallback={
              <div role='status' aria-label='正在加载文章'>
                <PostListLoader />
              </div>
            }
          >
            <PostList />
          </Suspense>
        </section>
      </PageContainer>
    </div>
  );
}
