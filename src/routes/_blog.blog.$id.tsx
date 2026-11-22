import { createFileRoute, notFound } from '@tanstack/react-router';

import { PostContent } from '~/components/features/blog/post-content';
import { PostHeader } from '~/components/features/blog/post-header';
import { Comments } from '~/components/features/comments';
import { getComments } from '~/components/features/comments/actions';
import { BlogPostSkeleton } from '~/components/features/page-skeletons';
import { PageContainer } from '~/components/ui/page-container';
import {
  buildPostOgUrl,
  getSiteOrigin,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '~/lib/site-meta';
import { getPost, type getPosts } from '~/server/functions';

type PostSummary = Awaited<ReturnType<typeof getPosts>>[number];
type PostDetail = Awaited<ReturnType<typeof getPost>>;

export const Route = createFileRoute('/_blog/blog/$id')({
  loader: async ({ context, params }) => {
    const cachedDetail = context.queryClient.getQueryData<PostDetail>(['post-detail', params.id]);
    if (cachedDetail) {
      void context.queryClient.prefetchQuery({
        queryKey: ['comments', params.id],
        queryFn: () => getComments({ data: params.id }),
      });
      return cachedDetail;
    }

    const cachedSummary = context.queryClient
      .getQueryData<PostSummary[]>(['post-list'])
      ?.find((item) => item.id === params.id);
    if (cachedSummary) {
      void context.queryClient.prefetchQuery({
        queryKey: ['post-detail', params.id],
        queryFn: () => getPost({ data: params.id }),
      });
      void context.queryClient.prefetchQuery({
        queryKey: ['comments', params.id],
        queryFn: () => getComments({ data: params.id }),
      });
      return cachedSummary;
    }

    const post = await context.queryClient.query({
      queryKey: ['post-detail', params.id],
      queryFn: () => getPost({ data: params.id }),
    });
    if (!post) throw notFound();
    await context.queryClient.query({
      queryKey: ['comments', params.id],
      queryFn: () => getComments({ data: params.id }),
    });
    return post;
  },
  head: ({ loaderData, params }) => {
    const origin = getSiteOrigin();
    const postTitle = loaderData?.title || SITE_TITLE;
    const description = loaderData?.description || loaderData?.summary || SITE_DESCRIPTION;
    const url = `${origin}/blog/${encodeURIComponent(params.id)}`;
    const ogImage = buildPostOgUrl(origin, params.id, loaderData?.updatedAt);
    const meta: Array<Record<string, string>> = [
      { title: loaderData?.title ? `${loaderData.title} · ${SITE_TITLE}` : SITE_TITLE },
      { name: 'description', content: description },
      { property: 'og:site_name', content: SITE_TITLE },
      { property: 'og:locale', content: 'zh_CN' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: postTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
      { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: postTitle },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: postTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];
    if (loaderData?.createdAt) {
      meta.push({
        property: 'article:published_time',
        content: new Date(loaderData.createdAt).toISOString(),
      });
    }
    if (loaderData?.updatedAt) {
      meta.push({
        property: 'article:modified_time',
        content: new Date(loaderData.updatedAt).toISOString(),
      });
    }
    return {
      meta,
      links: [{ rel: 'canonical', href: url }],
    };
  },
  pendingComponent: BlogPostSkeleton,
  component: BlogPage,
});

function BlogPage() {
  const { id } = Route.useParams();
  const post = Route.useLoaderData();
  return (
    <PageContainer className='article-container pt-20 sm:pt-24'>
      <PostHeader title={post.title ?? 'akumanoko'} />
      <PostContent id={id} />
      <Comments id={id} />
    </PageContainer>
  );
}
