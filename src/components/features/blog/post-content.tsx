import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCalendar,
  IconCheck,
  IconClock,
  IconLink,
  IconList,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { BannerBloom } from '~/components/features/blog/banner-bloom';
import { PostBodyLoader } from '~/components/features/post-loader';
import { Badge } from '~/components/ui/badge';
import { Sheet, SheetHeader, SheetPanel, SheetPopup, SheetTitle } from '~/components/ui/sheet';
import { TimeDisplay } from '~/components/ui/time-display';
import { toastManager } from '~/components/ui/toast';
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useArticleEnhancements } from '~/hooks/use-article-enhancements';
import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { fetchPublicPost, fetchPublicPosts, type PostSummary } from '~/lib/api';
import { countArticleWords, estimateReadingMinutes } from '~/lib/article-utils';
import { cn } from '~/lib/utils';

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

/**
 * 文章详情正文视图。
 *
 * 从 `['post-list']` 缓存读取摘要作为 `placeholderData`，在正文 HTML 仍在拉取时立即渲染封面、标题与日期，
 * 避免从首页跳转时出现整页骨架屏闪烁。
 */
export function PostContent({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [tocOpen, setTocOpen] = useState(false);

  const cachedSummary = queryClient
    .getQueryData<PostSummary[]>(['post-list'])
    ?.find((item) => item.id === id);

  const { data, isPending } = useQuery({
    queryKey: ['post-detail', id],
    queryFn() {
      return fetchPublicPost(id);
    },
    placeholderData: cachedSummary
      ? { ...cachedSummary, htmlContent: null as string | null }
      : undefined,
  });

  const { data: postList } = useQuery({
    queryKey: ['post-list'],
    queryFn: () => fetchPublicPosts(),
  });

  const isBodyPending = isPending || data?.htmlContent === null;
  const showBodySkeleton = useDelayedPending(isBodyPending && !data?.htmlContent);

  const { tocItems, activeId, lightboxImage, closeLightbox } = useArticleEnhancements(
    bodyRef,
    data?.htmlContent,
  );

  const wordCount = useMemo(() => {
    if (!data?.htmlContent) return 0;
    return countArticleWords(data.htmlContent);
  }, [data?.htmlContent]);

  const showUpdatedAt = useMemo(() => {
    if (!data?.createdAt || !data?.updatedAt) return false;
    return new Date(data.updatedAt).getTime() - new Date(data.createdAt).getTime() > 86_400_000;
  }, [data?.createdAt, data?.updatedAt]);

  const { prevPost, nextPost } = useMemo(() => {
    if (!postList || postList.length < 2) return { prevPost: null, nextPost: null };
    const index = postList.findIndex((item) => item.id === id);
    if (index === -1) return { prevPost: null, nextPost: null };
    return {
      prevPost: index < postList.length - 1 ? postList[index + 1] : null,
      nextPost: index > 0 ? postList[index - 1] : null,
    };
  }, [postList, id]);

  const renderedBody = useMemo(
    () => <ArticleBody html={data?.htmlContent || ''} imageSeed={data?.id ?? id} />,
    [data?.htmlContent, data?.id, id],
  );

  return (
    <div className='post-content relative'>
      {data?.banner ? (
        <BannerBloom
          src={data.banner}
          alt={data.title ?? ''}
          seed={`banner:${data.id}:${data.banner}`}
        />
      ) : null}

      <div className='mt-12 mb-8'>
        <h1 className='article-title mb-5'>{data?.title}</h1>
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <IconCalendar className='size-3.5' />
            <TimeDisplay value={data?.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
          </span>
          {showUpdatedAt ? (
            <span className='inline-flex items-center gap-1'>
              更新于 <TimeDisplay value={data?.updatedAt} options={{ format: 'YYYY年MM月DD日' }} />
            </span>
          ) : null}
          {wordCount > 0 ? (
            <span className='inline-flex items-center gap-1.5'>
              <IconClock className='size-3.5' />约 {wordCount.toLocaleString()} 字 ·{' '}
              {estimateReadingMinutes(wordCount)} 分钟
            </span>
          ) : null}
        </div>
        {data?.tags && data.tags.length > 0 ? (
          <div className='mt-3 flex flex-wrap gap-1.5'>
            {data.tags.map((tag) => (
              <Link key={tag.id} to='/' search={{ tag: tag.name }}>
                <Badge
                  variant='outline'
                  className='cursor-pointer font-normal text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground'
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {data?.summary ? (
        <blockquote
          aria-label='文章摘要'
          className='mb-8 border-l-2 border-border/80 py-0.5 pl-3.5 text-sm leading-relaxed text-muted-foreground'
        >
          <IconSparkles
            aria-hidden='true'
            className='mr-1.5 inline-block size-3.5 align-[-2px] text-muted-foreground/75'
          />
          {data.summary}
        </blockquote>
      ) : null}

      {tocItems.length >= 2 ? (
        <>
          <button
            type='button'
            aria-label='打开文章目录'
            onClick={() => setTocOpen(true)}
            className='fixed right-5 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 inline-flex size-9 items-center justify-center rounded-lg bg-popover/75 text-foreground/80 shadow-2xs ring-1 ring-border/50 backdrop-blur-md transition-colors hover:bg-popover/90 hover:text-foreground xl:hidden'
          >
            <IconList className='size-4.5' />
          </button>

          <Sheet open={tocOpen} onOpenChange={setTocOpen}>
            <SheetPopup side='bottom' className='max-h-[70vh] rounded-t-2xl xl:hidden'>
              <div className='mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border' />
              <SheetHeader className='flex-row items-center justify-between px-5 pt-3 pb-2'>
                <SheetTitle className='flex items-center gap-2 text-base font-medium'>
                  <IconList className='size-4 text-muted-foreground' />
                  目录
                </SheetTitle>
                <span className='pr-8 text-xs text-muted-foreground tabular-nums'>
                  {tocItems.length} 节
                </span>
              </SheetHeader>
              <SheetPanel className='px-4 pt-1 pb-6'>
                <nav aria-label='文章目录' className='flex flex-col gap-0.5'>
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        type='button'
                        onClick={() => {
                          setTocOpen(false);
                          setTimeout(() => {
                            document
                              .getElementById(item.id)
                              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 120);
                        }}
                        className={cn(
                          'relative flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          item.level === 3 && 'pl-6 text-[13px]',
                          isActive
                            ? 'bg-accent/70 font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                        )}
                      >
                        {isActive ? (
                          <span className='absolute left-1 h-4 w-0.5 rounded-full bg-foreground' />
                        ) : null}
                        <span className='line-clamp-1'>{item.text}</span>
                      </button>
                    );
                  })}
                </nav>
              </SheetPanel>
            </SheetPopup>
          </Sheet>
        </>
      ) : null}

      {tocItems.length >= 2 ? (
        <aside
          aria-label='文章目录'
          className='fixed top-28 right-8 hidden max-h-[calc(100vh-9rem)] w-48 overflow-y-auto xl:block'
        >
          <p className='mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80'>
            <IconList className='size-3' />
            目录
          </p>
          <nav className='flex flex-col gap-1 border-l border-border/70 pl-3'>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'line-clamp-2 py-0.5 text-xs leading-snug text-muted-foreground/75 transition-colors hover:text-foreground',
                  item.level === 3 && 'pl-2.5',
                  activeId === item.id && 'font-medium text-foreground',
                )}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </aside>
      ) : null}

      <div ref={bodyRef}>
        {showBodySkeleton ? (
          <div role='status' aria-label='正在加载文章内容'>
            <PostBodyLoader />
          </div>
        ) : (
          <div className='tiptap ProseMirror'>{renderedBody}</div>
        )}
      </div>

      {!isBodyPending && (prevPost || nextPost) ? (
        <footer className='mt-12 border-t border-border/60 pt-6'>
          <nav aria-label='上下篇导航' className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {prevPost ? (
              <Link
                to='/blog/$id'
                params={{ id: prevPost.id }}
                className='group flex flex-col gap-1 rounded-lg border border-border/70 bg-card/50 px-3.5 py-2.5 transition-colors hover:bg-accent/50'
              >
                <span className='inline-flex items-center gap-1 text-[11px] text-muted-foreground'>
                  <IconArrowLeft className='size-3' />
                  上一篇
                </span>
                <span className='line-clamp-1 text-sm font-medium text-foreground'>
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div className='hidden sm:block' />
            )}
            {nextPost ? (
              <Link
                to='/blog/$id'
                params={{ id: nextPost.id }}
                className='group flex flex-col items-end gap-1 rounded-lg border border-border/70 bg-card/50 px-3.5 py-2.5 text-right transition-colors hover:bg-accent/50'
              >
                <span className='inline-flex items-center gap-1 text-[11px] text-muted-foreground'>
                  下一篇
                  <IconArrowRight className='size-3' />
                </span>
                <span className='line-clamp-1 text-sm font-medium text-foreground'>
                  {nextPost.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </footer>
      ) : null}

      {!isBodyPending ? <ArticleToolbar bodyRef={bodyRef} hasToc={tocItems.length >= 2} /> : null}

      {lightboxImage ? (
        <div
          role='dialog'
          aria-modal='true'
          aria-label='图片预览'
          onClick={closeLightbox}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs'
        >
          <button
            type='button'
            onClick={closeLightbox}
            aria-label='关闭预览'
            className='fixed top-4 right-4 inline-flex size-9 items-center justify-center rounded-lg bg-popover/90 text-foreground shadow-sm transition-colors hover:bg-popover'
          >
            <IconX className='size-4' />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClick={(e) => e.stopPropagation()}
            className='max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-xl'
          />
        </div>
      ) : null}
    </div>
  );
}

const TOOLBAR_BUTTON_CLASS =
  'inline-flex size-8 items-center justify-center bg-transparent text-muted-foreground/75 transition-colors hover:text-foreground focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

function ArticleToolbar({
  bodyRef,
  hasToc,
}: {
  bodyRef: RefObject<HTMLDivElement | null>;
  hasToc: boolean;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toastManager.add({ type: 'success', title: '已复制文章链接' });
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setCopiedLink(false);
        resetTimerRef.current = null;
      }, 1800);
    } catch {
      toastManager.add({ type: 'error', title: '复制失败' });
    }
  }

  function handleBackToTop() {
    const scrollViewport = bodyRef.current?.closest('[data-slot="scroll-area-viewport"]');
    if (scrollViewport) {
      scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <TooltipProvider delay={150}>
      <div
        role='toolbar'
        aria-label='文章工具栏'
        className={cn(
          'fixed z-20 flex flex-col items-center gap-1.5 lg:right-auto lg:bottom-8 lg:left-[calc(50%+var(--article-width)/2+1.5rem)]',
          'right-4',
          hasToc
            ? 'bottom-[calc(4.75rem+env(safe-area-inset-bottom))]'
            : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom))]',
        )}
      >
        <Tooltip>
          <TooltipTrigger
            type='button'
            onClick={handleCopyLink}
            aria-label={copiedLink ? '已复制链接' : '复制链接'}
            className={TOOLBAR_BUTTON_CLASS}
          >
            {copiedLink ? <IconCheck className='size-4' /> : <IconLink className='size-4' />}
          </TooltipTrigger>
          <TooltipPopup side='right'>{copiedLink ? '已复制链接' : '复制链接'}</TooltipPopup>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            type='button'
            onClick={handleBackToTop}
            aria-label='返回顶部'
            className={TOOLBAR_BUTTON_CLASS}
          >
            <IconArrowUp className='size-4' />
          </TooltipTrigger>
          <TooltipPopup side='right'>返回顶部</TooltipPopup>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
