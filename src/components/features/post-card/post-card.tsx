import { ImageIcon } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { TimeDisplay } from '~/components/ui/time-display';
import type { posts } from '~/db/schema';
import { cn } from '~/lib/utils';

interface PostTag {
  id: string;
  name: string;
}

interface PostCardProps {
  post: Omit<typeof posts.$inferSelect, 'createdAt' | 'updatedAt'> & {
    createdAt: Date | string;
    updatedAt: Date | string;
    tags?: PostTag[];
  };
  className?: string;
  showMeta?: boolean;
}

export function PostCard(props: PostCardProps) {
  const { post, className, showMeta = true } = props;
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card/70 transition-colors hover:bg-card',
        className,
      )}
    >
      <div className='aspect-video w-full overflow-hidden bg-muted/50'>
        {post.banner ? (
          <img className='size-full object-cover' src={post.banner} alt={post.title || ''} />
        ) : (
          <div className='flex size-full items-center justify-center text-muted-foreground/40'>
            <ImageIcon className='size-6' />
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-2 p-3.5 select-none'>
        <h2 className='line-clamp-1 text-base font-medium text-foreground'>
          {post.title || '无标题文章'}
        </h2>
        <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
          {post.description || '暂无简介'}
        </p>
        {post.tags && post.tags.length > 0 ? (
          <div className='flex flex-wrap gap-1'>
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant='secondary' className='h-4 px-1.5 text-[10px] font-normal'>
                #{tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
        {showMeta ? (
          <div className='mt-auto flex items-center justify-between pt-1'>
            <Badge variant={post.published ? 'default' : 'outline'} className='text-[11px]'>
              {post.published ? '已发布' : '草稿'}
            </Badge>
            <TimeDisplay
              className='text-xs text-muted-foreground/75 tabular-nums'
              value={post.createdAt}
              options={{ format: 'YYYY-MM-DD' }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
