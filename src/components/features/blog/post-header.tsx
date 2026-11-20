import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import { m, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';

export function PostHeader({ title }: { title: string }) {
  const ref = useRef<React.ComponentRef<'div'>>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const anchor = ref.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const next =
          !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
        setVisible((previous) => (previous === next ? previous : next));
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <m.div
        className='article-sticky-header'
        data-visible={visible}
        aria-hidden={!visible}
        inert={!visible}
        initial={false}
        animate={{ y: visible ? 0 : '-160%', opacity: visible ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button
          render={<Link to='/blog' aria-label='返回文章列表' />}
          aria-label='返回文章列表'
          size='icon-sm'
          variant='ghost'
          className='shrink-0'
        >
          <Icon className='size-4' icon='ri:arrow-left-line' />
        </Button>
        <span className='min-w-0 truncate text-left text-sm font-medium'>{title}</span>
      </m.div>
      <div className='mb-12 h-8' ref={ref}>
        <Button
          render={<Link to='/blog' aria-label='返回文章列表' />}
          aria-label='返回文章列表'
          size='icon-sm'
          variant='ghost'
          shape='paper'
        >
          <Icon className='size-4' icon='ri:arrow-left-line' />
        </Button>
      </div>
    </>
  );
}
