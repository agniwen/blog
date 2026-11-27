import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';

import {
  createPreviewCardHandle,
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from '~/components/ui/preview-card';
import { TimeDisplay } from '~/components/ui/time-display';
import { fetchPublicPosts, type PostSummary } from '~/lib/api';

interface PointerPoint {
  x: number;
  y: number;
  contextElement: Element;
}

function createCursorAnchor(point: PointerPoint) {
  return {
    contextElement: point.contextElement,
    getBoundingClientRect() {
      return new DOMRect(point.x, point.y, 0, 0);
    },
  };
}

function PostPreviewOverlay({
  handle,
  listRef,
  pointerRef,
}: {
  handle: ReturnType<typeof createPreviewCardHandle<PostSummary>>;
  listRef: RefObject<HTMLDivElement | null>;
  pointerRef: RefObject<PointerPoint | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cursorAnchor, setCursorAnchor] = useState<
    ReturnType<typeof createCursorAnchor> | undefined
  >(undefined);

  useEffect(() => {
    if (!isOpen) return;
    const listEl = listRef.current;
    if (!listEl) return;

    let rafId: number | null = null;
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const point: PointerPoint = {
        x: event.clientX,
        y: event.clientY,
        contextElement: event.target instanceof Element ? event.target : listEl,
      };
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setCursorAnchor(createCursorAnchor(pointerRef.current ?? point));
      });
    };

    listEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      listEl.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isOpen, listRef, pointerRef]);

  return (
    <PreviewCard
      handle={handle}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setCursorAnchor(pointerRef.current ? createCursorAnchor(pointerRef.current) : undefined);
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) setCursorAnchor(undefined);
      }}
    >
      {({ payload: post }) => {
        if (!post) return null;
        const previewDescription = post.description || post.summary;

        return (
          <PreviewCardPopup
            anchor={cursorAnchor}
            side='right'
            align='center'
            sideOffset={16}
            positionerClassName='pointer-events-none'
            className='pointer-events-none w-76 flex-col overflow-hidden p-0'
          >
            {post.banner ? (
              <div className='aspect-16/10 w-full overflow-hidden border-b border-border/60 bg-muted/40'>
                <img
                  src={post.banner}
                  alt={post.title ?? ''}
                  loading='lazy'
                  className='size-full object-cover'
                />
              </div>
            ) : null}
            <div className='w-full space-y-1.5 p-3.5'>
              <p className='text-sm leading-snug font-medium text-foreground'>{post.title}</p>
              <TimeDisplay
                value={post.createdAt}
                options={{ format: 'YYYY年MM月DD日' }}
                className='block text-xs text-muted-foreground/75 tabular-nums'
              />
              {previewDescription ? (
                <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                  {previewDescription}
                </p>
              ) : null}
            </div>
          </PreviewCardPopup>
        );
      }}
    </PreviewCard>
  );
}

export function PostList() {
  const { tag } = useSearch({ from: '/_blog/' });
  const { data } = useQuery({
    queryKey: ['post-list'],
    async queryFn() {
      return fetchPublicPosts();
    },
  });

  const previewHandle = useMemo(() => createPreviewCardHandle<PostSummary>(), []);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<PointerPoint | null>(null);

  const filteredPosts = tag
    ? data?.filter((post) => post.tags?.some((item) => item.name === tag))
    : data;

  return (
    <div>
      {tag ? (
        <div className='mb-4 flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground'>
          <span>
            标签筛选：<span className='font-medium text-foreground'>#{tag}</span>
          </span>
          <Link
            to='/'
            search={{}}
            className='inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground'
          >
            <Icon icon='lucide:x' className='size-3.5' />
            清除
          </Link>
        </div>
      ) : null}

      <div
        ref={listRef}
        className='divide-y divide-border/50'
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse') return;
          pointerRef.current = {
            x: event.clientX,
            y: event.clientY,
            contextElement: event.target instanceof Element ? event.target : event.currentTarget,
          };
        }}
        onFocusCapture={(event) => {
          if (event.target instanceof Element && event.target.matches(':focus-visible')) {
            pointerRef.current = null;
          }
        }}
      >
        {filteredPosts?.map((post) => (
          <div key={post.id} className='py-1 first:pt-0 last:pb-0'>
            <PreviewCardTrigger
              handle={previewHandle}
              payload={post}
              delay={250}
              closeDelay={100}
              render={
                <Link
                  to='/blog/$id'
                  params={{ id: post.id }}
                  preload='intent'
                  viewTransition
                  className='group -mx-3 flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent/45 motion-reduce:transition-none'
                />
              }
            >
              <h2 className='text-[15px] font-medium text-foreground'>{post.title}</h2>
              <TimeDisplay
                value={post.createdAt}
                options={{ format: 'YYYY年MM月DD日' }}
                className='shrink-0 text-xs text-nowrap text-muted-foreground/75 tabular-nums'
              />
            </PreviewCardTrigger>
          </div>
        ))}
        {tag && filteredPosts && filteredPosts.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>该标签下暂无已发布文章</p>
        ) : null}
      </div>

      <PostPreviewOverlay handle={previewHandle} listRef={listRef} pointerRef={pointerRef} />
    </div>
  );
}
