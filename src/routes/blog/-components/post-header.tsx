import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import { useIsClient } from 'foxact/use-is-client';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function PostHeader() {
  const ref = useRef<React.ComponentRef<'div'>>(null);
  const inView = useInView(ref, { initial: true });
  const isClient = useIsClient();
  return (
    <>
      <div
        className={cn(
          'invisible fixed top-0 left-0 z-10 w-full bg-background/90 backdrop-blur-md transition-all',
          inView ? 'invisible opacity-0' : 'visible opacity-100',
        )}
      >
        <div
          className={cn('relative mx-auto flex max-w-2xl items-center justify-between px-4 py-0.5')}
        >
          <Link to='/blog' className='invisible p-1 md:visible'>
            <Button size='icon' className='rounded-full' variant='ghost'>
              <Icon className='size-4 text-xl' icon='ri:arrow-left-line' />
            </Button>
          </Link>
          <span className='text-sm font-bold'>
            {isClient ? document?.title.replace('- akumanoko', '') : ''}
          </span>
          <span className='size-6'></span>
        </div>
      </div>
      <div className='mb-12' ref={ref}>
        <Link to='/blog'>
          <Button size='icon' variant='secondary' className='rounded-full text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
    </>
  );
}
