import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Comments } from '~/components/features/comments';
import { PostLoader } from '~/components/features/post-loader/post-loader';
import { PageContainer } from '~/components/ui/page-container';
import { getCommentsServerFn } from '~/server-fns/comments';
import { getPublishedPostServerFn } from '~/server-fns/posts';
import { PostHeader } from './-components/post-header';
import { PostContent } from './-content';
import '~/components/features/editor/simple-editor.css';

export const Route = createFileRoute('/blog/$id')({
  pendingComponent: BlogDetailPendingPage,
  pendingMs: 0,
  loader: async ({ params }) => {
    const [post, comments] = await Promise.all([
      getPublishedPostServerFn({ data: { id: params.id } }),
      getCommentsServerFn({ data: { postId: params.id } }),
    ]);

    return { post, comments };
  },
  headers: () => ({
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
  }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.post?.title ?? 'Blog' },
      { name: 'description', content: loaderData?.post?.description ?? '' },
    ],
  }),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { id } = Route.useParams();
  const { post, comments } = Route.useLoaderData();

  return (
    <PageContainer className='pt-12 px-4 max-w-2xl mx-auto'>
      <PostHeader />
      <PostContent post={post} />
      <Comments id={id} initialComments={comments} />
    </PageContainer>
  );
}

function BlogDetailPendingPage() {
  return (
    <PageContainer className='pt-12 px-4 max-w-2xl mx-auto'>
      <PostHeader />
      <PostLoader />
    </PageContainer>
  );
}
