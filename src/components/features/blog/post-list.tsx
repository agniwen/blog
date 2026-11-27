import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';

import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from '~/components/ui/preview-card';
import { TimeDisplay } from '~/components/ui/time-display';
import { fetchPublicPosts } from '~/lib/api';

export function PostList() {
  const { tag } = useSearch({ from: '/_blog/' });
  const { data } = useQuery({
    queryKey: ['post-list'],
    async queryFn() {
      return fetchPublicPosts();
    },
  });

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
            <Icon icon='lucide:x' className='size-3.5' />
            清除
          </Link>
        </div>
      ) : null}

      <div className='divide-y divide-border/50'>
        {filteredPosts?.map((post) => {
          const previewDescription = post.description || post.summary;

          return (
            <div key={post.id} className='py-1 first:pt-0 last:pb-0'>
              <PreviewCard>
                <PreviewCardTrigger
                  delay={250}
                  closeDelay={100}
                  render={
                    <Link
                      to='/blog/$id'
                      params={{ id: post.id }}
                      preload='intent'
                      viewTransition
                      className='group -mx-3 block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent/45 motion-reduce:transition-none'
                    />
                  }
                >
                  <article className='flex items-baseline justify-between gap-4'>
                    <h2 className='text-[15px] font-medium text-foreground'>{post.title}</h2>
                    <span className='shrink-0 text-xs text-nowrap text-muted-foreground/75 tabular-nums'>
                      <TimeDisplay value={post.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
                    </span>
                  </article>
                </PreviewCardTrigger>
                <PreviewCardPopup
                  side='right'
                  align='center'
                  sideOffset={16}
                  className='w-76 flex-col overflow-hidden p-0'
                >
                  {post.banner ? (
                    <div className='aspect-16/10 w-full overflow-hidden border-b border-border/60 bg-muted/40'>
                      <img
                        src={post.banner}
                        alt={post.title ?? ''}
                        loading='lazy'
                        className='size-full object-cover'
                      />
                    </div>
                  ) : null}
                  <div className='w-full space-y-1.5 p-3.5'>
                    <p className='text-sm leading-snug font-medium text-foreground'>{post.title}</p>
                    <p className='text-xs text-muted-foreground/75 tabular-nums'>
                      <TimeDisplay value={post.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
                    </p>
                    {previewDescription ? (
                      <p className='line-clamp-3 text-xs leading-relaxed text-muted-foreground'>
                        {previewDescription}
                      </p>
                    ) : null}
                  </div>
                </PreviewCardPopup>
              </PreviewCard>
            </div>
          );
        })}
        {tag && filteredPosts && filteredPosts.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>该标签下暂无已发布文章</p>
        ) : null}
      </div>
    </div>
  );
}
