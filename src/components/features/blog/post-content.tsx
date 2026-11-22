import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

import { PaperImage } from '~/components/features/blog/paper-image';
import { PostBodyLoader } from '~/components/features/post-loader';
import { TimeDisplay } from '~/components/ui/time-display';
import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { getPost, type getPosts } from '~/server/functions';

import { ArticleBody } from './article-body';

import '~/components/tiptap/node/blockquote-node/blockquote-node.css';
import '~/components/tiptap/node/code-block-node/code-block-node.css';
import '~/components/tiptap/node/horizontal-rule-node/horizontal-rule-node.css';
import '~/components/tiptap/node/list-node/list-node.css';
import '~/components/tiptap/node/image-node/image-node.css';
import '~/components/tiptap/node/iframe-node/iframe-node.css';
import '~/components/tiptap/node/heading-node/heading-node.css';
import '~/components/tiptap/node/paragraph-node/paragraph-node.css';
import '~/components/tiptap/node/bookmark-node/bookmark-node.css';
import '~/components/features/editor/simple-editor.css';

type PostSummary = Awaited<ReturnType<typeof getPosts>>[number];

/**
 * 文章详情正文视图。
 *
 * 从 `['post-list']` 缓存读取摘要作为 `placeholderData`，在正文 HTML 仍在拉取时立即渲染封面、标题与日期，
 * 避免从首页跳转时出现整页骨架屏闪烁。
 */
export function PostContent({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cachedSummary = queryClient
    .getQueryData<PostSummary[]>(['post-list'])
    ?.find((item) => item.id === id);
  const { data, isPending } = useQuery({
    queryKey: ['post-detail', id],
    queryFn() {
      return getPost({ data: id });
    },
    placeholderData: cachedSummary
      ? { ...cachedSummary, htmlContent: null as string | null }
      : undefined,
  });

  const isBodyPending = isPending || data?.htmlContent === null;
  const showBodySkeleton = useDelayedPending(isBodyPending && !data?.htmlContent);

  return (
    <div className='post-content'>
      {data?.banner ? (
        <div className='pointer-events-none relative mb-8 aspect-16/10 *:select-none'>
          <PaperImage
            seed={`banner:${data.id}:${data.banner}`}
            className='relative z-2 aspect-16/10 object-cover'
            src={data.banner}
            alt={data.title ?? ''}
          />
          <img
            className='pointer-events-none absolute top-10 left-0 z-1 aspect-16/10 rounded-xs object-cover opacity-30 blur-3xl'
            src={data.banner}
            alt={data.title ?? ''}
          />
        </div>
      ) : null}
      <div className='mt-12 mb-8'>
        <h1 className='article-title mb-6'>{data?.title}</h1>
        <p className='flex items-center gap-8 text-sm opacity-80'>
          <span className='flex items-center gap-1'>
            <Calendar className='size-4' />
            创建时间
          </span>
          <span>
            <TimeDisplay value={data?.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
          </span>
        </p>
      </div>
      <div>
        {showBodySkeleton ? (
          <div role='status' aria-label='正在加载文章内容'>
            <PostBodyLoader />
          </div>
        ) : (
          <div className='tiptap ProseMirror'>
            <ArticleBody html={data?.htmlContent || ''} imageSeed={data?.id ?? id} />
          </div>
        )}
      </div>
    </div>
  );
}
