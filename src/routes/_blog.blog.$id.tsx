import { createFileRoute, notFound } from '@tanstack/react-router';

import { PostContent } from '~/components/features/blog/post-content';
import { PostHeader } from '~/components/features/blog/post-header';
import { Comments } from '~/components/features/comments';
import { getComments } from '~/components/features/comments/actions';
import { BlogPostSkeleton } from '~/components/features/page-skeletons';
import { PageContainer } from '~/components/ui/page-container';
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
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? 'akumanoko' },
      { name: 'description', content: loaderData?.description ?? 'akumanoko' },
    ],
  }),
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
