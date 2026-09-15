import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { TimeDisplay } from '~/components/ui/time-display';
import { getPosts } from '~/server/functions';

export function PostList() {
  const { data } = useQuery({
    queryKey: ['post-list'],
    async queryFn() {
      return getPosts();
    },
  });
  return (
    <div className='grid grid-cols-1 divide-y divide-border/60'>
      {data?.map((post) => (
        // oxlint-disable-next-line jsx-a11y/control-has-associated-label
        <Link
          key={post.id}
          to='/blog/$id'
          params={{ id: post.id }}
          preload='intent'
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
