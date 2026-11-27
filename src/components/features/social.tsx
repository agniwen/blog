import { Icon } from '@iconify/react';
import { AnimatePresence } from 'motion/react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const socials = [
  {
    name: 'Twitter',
    url: 'https://x.com/agniwen',
    icon: <Icon className='size-5' icon='ri:twitter-x-fill' />,
  },
  {
    name: 'github',
    url: 'https://github.com/agniwen',
    icon: <Icon className='size-5' icon='ri:github-line' />,
  },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/2940875',
    icon: <Icon className='size-5' icon='ri:bilibili-line' />,
  },
  {
    name: 'email',
    url: 'mailto:wisakura@outlook.com',
    icon: <Icon className='size-5' icon='ri:mail-line' />,
  },
  {
    name: 'RSS',
    url: '/rss.xml',
    icon: <Icon className='size-5' icon='ri:rss-line' />,
  },
];

export function Social({ className }: { className?: string }) {
  return (
    <div className={cn('-ml-1.5 flex h-8 items-center space-x-4', className)}>
      <AnimatePresence>
        {socials.map((s) => {
          return (
            <Button
              render={<a href={s.url} target='_blank' rel='noreferrer' />}
              key={s.url}
              variant='ghost'
              shape='paper'
              aria-label={s.name}
              size={'icon-sm'}
            >
              {s.icon}
            </Button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
