import { Icon } from '@iconify/react';
import { Link } from '@void/react';
import { m, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';

export function PostHeader({ title }: { title: string }) {
  const ref = useRef<React.ComponentRef<'div'>>(null);
  const [{ expanded, animateLayout }, setLayout] = useState({
    expanded: false,
    animateLayout: true,
  });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const anchor = ref.current;
    if (!anchor) return;

    // The anchor stays in flow, so expanding the paper cannot retrigger itself.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const next = {
          expanded: entry.boundingClientRect.top < (entry.rootBounds?.top ?? 16),
          // A large scroll jump has no visible source to animate out of.
          animateLayout: entry.boundingClientRect.bottom > 0,
        };
        setLayout((previous) =>
          previous.expanded === next.expanded && previous.animateLayout === next.animateLayout
            ? previous
            : next,
        );
      },
      { rootMargin: '-16px 0px 0px 0px', threshold: 1 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  const layoutTransition =
    reducedMotion || !animateLayout
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 380, damping: 34, mass: 0.8 };

  return (
    <div className='mb-12 h-8' ref={ref}>
      <m.div
        className='article-sticky-header'
        data-expanded={expanded}
        initial={false}
        layout={!reducedMotion}
        layoutScroll
        transition={{ layout: layoutTransition }}
      >
        <m.div
          layout={reducedMotion ? false : 'position'}
          className='shrink-0'
          transition={{ layout: layoutTransition }}
        >
          <Button
            render={<Link href='/blog' aria-label='返回文章列表' />}
            aria-label='返回文章列表'
            size='icon-sm'
            variant='ghost'
          >
            <Icon className='size-4' icon='ri:arrow-left-line' />
          </Button>
        </m.div>
        <m.span
          className='article-header-title min-w-0 truncate text-left text-sm font-medium'
          aria-hidden={!expanded}
          initial={false}
          layout={reducedMotion ? false : 'position'}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{
            layout: layoutTransition,
            opacity: {
              duration: reducedMotion ? 0 : 0.16,
              delay: expanded && !reducedMotion && animateLayout ? 0.1 : 0,
            },
          }}
        >
          {title}
        </m.span>
      </m.div>
    </div>
  );
}
