import { useQuery } from '@tanstack/react-query';
import { Await, createFileRoute, notFound } from '@tanstack/react-router';

import { PostContent } from '~/components/features/blog/post-content';
import { PostHeader } from '~/components/features/blog/post-header';
import { Comments } from '~/components/features/comments';
import { BlogPostSkeleton } from '~/components/features/page-skeletons';
import { CommentsLoader } from '~/components/features/post-loader';
import { PageContainer } from '~/components/ui/page-container';
import { fetchPublicComments, fetchPublicPost, type PostDetail, type PostSummary } from '~/lib/api';
import {
  buildPostOgUrl,
  getSiteOrigin,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '~/lib/site-meta';

export const Route = createFileRoute('/_blog/blog/$id')({
  // 三级数据回退策略，兼顾秒开体验与 SSR 直达 404 状态码：
  // 1. 已有完整详情缓存时直接返回并后台预取评论；
  // 2. 从首页跳入且命中 `post-list` 摘要时立即放行渲染，同时异步预取正文与评论；
  // 3. 首次直达仅等待正文来判断 404，评论随后通过独立边界流式输出。
  loader: async ({ context, params }) => {
    const commentsReady = context.queryClient.prefetchQuery({
      queryKey: ['comments', params.id],
      queryFn: () => fetchPublicComments(params.id),
    });
    const cachedDetail = context.queryClient.getQueryData<PostDetail>(['post-detail', params.id]);
    if (cachedDetail) {
      return { post: cachedDetail };
    }

    const cachedSummary = context.queryClient
      .getQueryData<PostSummary[]>(['post-list'])
      ?.find((item) => item.id === params.id);
    if (cachedSummary) {
      void context.queryClient.prefetchQuery({
        queryKey: ['post-detail', params.id],
        queryFn: () => fetchPublicPost(params.id),
      });
      return { post: cachedSummary };
    }

    const post = await context.queryClient.query({
      queryKey: ['post-detail', params.id],
      queryFn: () => fetchPublicPost(params.id),
    });
    if (!post) throw notFound({ headers: { 'Cache-Control': 'no-store' } });
    return { post, commentsReady };
  },
  headers: () => ({
    'Cache-Control': 'no-store',
  }),
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const origin = getSiteOrigin();
    const postTitle = post?.title || SITE_TITLE;
    const description = post?.description || post?.summary || SITE_DESCRIPTION;
    const url = `${origin}/blog/${encodeURIComponent(params.id)}`;
    const ogImage = buildPostOgUrl(origin, params.id, post?.updatedAt);
    const meta: Array<Record<string, string>> = [
      { title: post?.title ? `${post.title} · ${SITE_TITLE}` : SITE_TITLE },
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
    if (post?.createdAt) {
      meta.push({
        property: 'article:published_time',
        content: new Date(post.createdAt).toISOString(),
      });
    }
    if (post?.updatedAt) {
      meta.push({
        property: 'article:modified_time',
        content: new Date(post.updatedAt).toISOString(),
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
  const { post, commentsReady } = Route.useLoaderData();
  const { data: hasPost } = useQuery({
    queryKey: ['post-detail', id],
    queryFn: () => fetchPublicPost(id),
    select: (detail) => Boolean(detail),
  });
  const comments = hasPost ? <Comments key={id} id={id} /> : null;

  return (
    <PageContainer className='article-container pt-20 sm:pt-24'>
      <PostHeader title={post.title ?? SITE_TITLE} postId={id} />
      <PostContent id={id} />
      {comments && commentsReady ? (
        <Await
          promise={commentsReady}
          fallback={
            <section aria-busy='true' aria-label='正在加载评论'>
              <CommentsLoader />
            </section>
          }
        >
          {() => comments}
        </Await>
      ) : (
        comments
      )}
    </PageContainer>
  );
}
