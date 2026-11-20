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
    <div className='divide-y divide-border/50'>
      {data?.map((post) => (
        <div key={post.id} className='py-1 first:pt-0 last:pb-0'>
          {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Link
            to='/blog/$id'
            params={{ id: post.id }}
            preload='intent'
            viewTransition
            className='group -mx-3 block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent/45 motion-reduce:transition-none'
          >
            <article className='space-y-1.5'>
              <div className='flex items-baseline justify-between gap-4'>
                <h2 className='text-[15px] font-medium text-foreground'>{post.title}</h2>
                <span className='shrink-0 text-xs text-nowrap text-muted-foreground/75 tabular-nums'>
                  <TimeDisplay value={post.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
                </span>
              </div>
              {post.description ? (
                <p className='line-clamp-2 text-[13px] leading-relaxed text-muted-foreground'>
                  {post.description}
                </p>
              ) : null}
            </article>
          </Link>
        </div>
      ))}
    </div>
  );
}
