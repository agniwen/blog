import { createFileRoute, notFound } from '@tanstack/react-router';

import { PostContent } from '~/components/features/blog/post-content';
import { PostHeader } from '~/components/features/blog/post-header';
import { Comments } from '~/components/features/comments';
import { getComments } from '~/components/features/comments/actions';
import { BlogPostSkeleton } from '~/components/features/page-skeletons';
import { PageContainer } from '~/components/ui/page-container';
import { getPost } from '~/server/functions';

export const Route = createFileRoute('/_blog/blog/$id')({
  loader: async ({ context, params }) => {
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
  component: () => <Blog id={Route.useParams().id} />,
});

function Blog({ id }: { id: string }) {
  return (
    <PageContainer className='mx-auto max-w-2xl px-4 pt-12'>
      <PostHeader />
      <PostContent id={id} />
      <Comments id={id} />
    </PageContainer>
  );
}
