import { IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { TimeDisplay } from '~/components/ui/time-display';
import { fetchPublicPosts, type PostSummary } from '~/lib/api';

const POINTER_OFFSET_X = 14;
const POINTER_OFFSET_Y = 12;
const VIEWPORT_PADDING = 12;
const OPEN_DELAY_MS = 180;
const CLOSE_DELAY_MS = 100;
const DEFAULT_CARD_SIZE = { width: 304, height: 260 };

interface Point {
  x: number;
  y: number;
}

interface PostPreviewController {
  enter(post: PostSummary, x: number, y: number): void;
  move(x: number, y: number): void;
  focus(post: PostSummary, rect: DOMRect): void;
  leave(): void;
  closeImmediate(): void;
}

function computeCardPosition(
  pointerX: number,
  pointerY: number,
  cardWidth: number,
  cardHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  let x = pointerX + POINTER_OFFSET_X;
  if (x + cardWidth + VIEWPORT_PADDING > viewportWidth) {
    x = pointerX - POINTER_OFFSET_X - cardWidth;
  }
  x = Math.max(VIEWPORT_PADDING, Math.min(x, viewportWidth - cardWidth - VIEWPORT_PADDING));

  const y = Math.max(
    VIEWPORT_PADDING,
    Math.min(pointerY + POINTER_OFFSET_Y, viewportHeight - cardHeight - VIEWPORT_PADDING),
  );

  return { x: Math.round(x), y: Math.round(y) };
}

function PostPreviewOverlay({ ref }: { ref: Ref<PostPreviewController> }) {
  const [activePost, setActivePost] = useState<PostSummary | null>(null);
  const positionerRef = useRef<HTMLDivElement | null>(null);
  const activePostRef = useRef<PostSummary | null>(null);
  const pointerRef = useRef<Point | null>(null);
  const sizeRef = useRef(DEFAULT_CARD_SIZE);
  const rafIdRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const applyPosition = useCallback(() => {
    const positioner = positionerRef.current;
    const pointer = pointerRef.current;
    if (!positioner || !pointer) return;

    const { width, height } = sizeRef.current;
    const { x, y } = computeCardPosition(
      pointer.x,
      pointer.y,
      width,
      height,
      window.innerWidth,
      window.innerHeight,
    );
    positioner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const schedulePosition = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      applyPosition();
    });
  }, [applyPosition]);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeImmediate = useCallback(() => {
    clearTimers();
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    activePostRef.current = null;
    setActivePost(null);
  }, [clearTimers]);

  useImperativeHandle(
    ref,
    () => ({
      enter(post, x, y) {
        if (closeTimerRef.current !== null) {
          window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        pointerRef.current = { x, y };

        if (activePostRef.current) {
          if (openTimerRef.current !== null) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
          }
          activePostRef.current = post;
          setActivePost(post);
          schedulePosition();
          return;
        }

        if (openTimerRef.current !== null) {
          window.clearTimeout(openTimerRef.current);
        }
        openTimerRef.current = window.setTimeout(() => {
          openTimerRef.current = null;
          activePostRef.current = post;
          setActivePost(post);
        }, OPEN_DELAY_MS);
      },
      move(x, y) {
        pointerRef.current = { x, y };
        if (activePostRef.current) {
          schedulePosition();
        }
      },
      focus(post, rect) {
        clearTimers();
        pointerRef.current = {
          x: rect.left + Math.min(rect.width * 0.5, 200),
          y: rect.bottom,
        };
        activePostRef.current = post;
        setActivePost(post);
      },
      leave() {
        if (openTimerRef.current !== null) {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        if (closeTimerRef.current !== null) {
          window.clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = window.setTimeout(() => {
          closeTimerRef.current = null;
          activePostRef.current = null;
          setActivePost(null);
        }, CLOSE_DELAY_MS);
      },
      closeImmediate,
    }),
    [clearTimers, closeImmediate, schedulePosition],
  );

  useLayoutEffect(() => {
    const positioner = positionerRef.current;
    if (!activePost || !positioner) return;

    const width = positioner.offsetWidth;
    const height = positioner.offsetHeight;
    if (width > 0 && height > 0) {
      sizeRef.current = { width, height };
    }
    applyPosition();
  }, [activePost, applyPosition]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!activePost) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') closeImmediate();
    };
    const handlePointerDown = () => closeImmediate();
    const handleScroll = () => closeImmediate();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activePost, closeImmediate]);

  if (!activePost || typeof document === 'undefined') return null;

  const previewDescription = activePost.description || activePost.summary;

  return createPortal(
    <div
      ref={positionerRef}
      aria-hidden='true'
      data-slot='preview-card-positioner'
      className='pointer-events-none fixed top-0 left-0 z-50 will-change-transform [contain:layout_style]'
    >
      <div
        data-slot='preview-card-content'
        className='relative flex w-76 origin-top-left flex-col overflow-hidden rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg/5 transition-[opacity,scale] duration-150 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] motion-reduce:transition-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)] starting:scale-98 starting:opacity-0'
      >
        {activePost.banner ? (
          <div className='aspect-video w-full overflow-hidden border-b border-border/60 bg-muted/40'>
            <img
              key={activePost.banner}
              src={activePost.banner}
              alt={activePost.title ?? ''}
              loading='eager'
              decoding='async'
              className='size-full object-cover'
            />
          </div>
        ) : null}
        <div className='flex w-full flex-col gap-1.5 px-3.5 py-3'>
          <p className='text-sm leading-snug font-medium text-foreground'>{activePost.title}</p>
          {previewDescription ? (
            <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
              {previewDescription}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
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

  const previewRef = useRef<PostPreviewController>(null);

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
            <IconX className='size-3.5' />
            清除
          </Link>
        </div>
      ) : null}

      <div
        className='divide-y divide-border/50'
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse') {
            previewRef.current?.move(event.clientX, event.clientY);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') {
            previewRef.current?.leave();
          }
        }}
      >
        {filteredPosts?.map((post) => (
          <div key={post.id} className='py-1 first:pt-0 last:pb-0'>
            <Link
              to='/blog/$id'
              params={{ id: post.id }}
              preload='intent'
              viewTransition
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') {
                  previewRef.current?.enter(post, event.clientX, event.clientY);
                }
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) {
                  previewRef.current?.focus(post, event.currentTarget.getBoundingClientRect());
                }
              }}
              onBlur={() => previewRef.current?.leave()}
              className='group -mx-3 flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent/45 motion-reduce:transition-none'
            >
              <h2 className='text-[15px] font-medium text-foreground'>{post.title}</h2>
              <TimeDisplay
                value={post.createdAt}
                options={{ format: 'YYYY年MM月DD日' }}
                className='shrink-0 text-xs text-nowrap text-muted-foreground/75 tabular-nums'
              />
            </Link>
          </div>
        ))}
        {tag && filteredPosts && filteredPosts.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>该标签下暂无已发布文章</p>
        ) : null}
      </div>

      <PostPreviewOverlay ref={previewRef} />
    </div>
  );
}
