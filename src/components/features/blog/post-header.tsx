import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import { useIsClient } from 'foxact/use-is-client';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function PostHeader() {
  const ref = useRef<React.ComponentRef<'div'>>(null);
  const inView = useInView(ref, { initial: true });
  const isClient = useIsClient();
  return (
    <>
      <div
        className={cn(
          'invisible fixed top-0 left-0 z-10 w-full bg-background backdrop-blur-md transition-all',
          inView ? 'invisible opacity-0' : 'visible opacity-100',
        )}
      >
        <div className='relative mx-auto grid h-11 max-w-2xl grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-3 px-4'>
          <Link
            to='/blog'
            aria-label='返回文章列表'
            className={cn(
              buttonVariants({ size: 'icon-sm', variant: 'ghost' }),
              'invisible md:visible',
            )}
          >
            <Icon className='size-4' icon='ri:arrow-left-line' />
          </Link>
          <span className='min-w-0 truncate text-center text-sm font-medium'>
            {isClient ? document?.title.replace('- akumanoko', '') : ''}
          </span>
          <span className='size-8' aria-hidden='true' />
        </div>
      </div>
      <div className='mb-12' ref={ref}>
        <Button
          render={<Link to='/blog' />}
          aria-label='返回文章列表'
          size='icon-sm'
          variant='ghost'
          className='text-xl'
        >
          <Icon icon='ri:arrow-left-line' />
        </Button>
      </div>
    </>
  );
}
