import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, m } from 'motion/react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const socials = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/wenhouman',
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
];

export function Social({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-8 space-x-5', className)}>
      <AnimatePresence>
        {socials.map((s, index) => {
          return (
            <m.div
              transition={{ delay: index * 0.05 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={s.url}
            >
              <Link to={s.url} target='_blank'>
                <Button size='icon-sm' variant='ghost' rel='noreferrer' className='cursor-default'>
                  {s.icon}
                </Button>
              </Link>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
