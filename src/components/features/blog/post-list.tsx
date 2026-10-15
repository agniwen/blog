import { Link } from '@void/react';

import { TimeDisplay } from '~/components/ui/time-display';
import type { Props } from '~/pages/(blog)/blog/index.server';

export function PostList({ posts: data }: Props) {
  return (
    <div className='grid grid-cols-1 divide-y divide-border/60'>
      {data?.map((post) => (
        // oxlint-disable-next-line jsx-a11y/control-has-associated-label
        <Link
          key={post.id}
          href={`/blog/${encodeURIComponent(post.id)}`}
          prefetch='hover'
          className='block transition-colors duration-150 hover:bg-accent/30 motion-reduce:transition-none'
        >
          <div className='space-y-1 py-3.5'>
            <h2>{post.title}</h2>
            <div className='flex items-end justify-between gap-12'>
              <div className='flex-1'>
                <p className='line-clamp-3 text-xs opacity-80'>{post.description}</p>
              </div>
              <span className='shrink-0 text-xs text-nowrap'>
                <TimeDisplay
                  className='opacity-60'
                  value={post.createdAt}
                  options={{ format: 'YYYY年MM月DD日' }}
                />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
