import { Badge } from '~/components/ui/badge';
import { TimeDisplay } from '~/components/ui/time-display';
import type { posts } from '~/db/schema';
import { cn } from '~/lib/utils';

interface PostCardProps {
  post: RPCResponse<typeof posts.$inferSelect> | typeof posts.$inferSelect;
  className?: string;
  showMeta?: boolean;
}

export function PostCard(props: PostCardProps) {
  const { post, className, showMeta = true } = props;
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border shadow-xs hover:opacity-90',
        className,
      )}
    >
      <div className='w-full'>
        <img
          className='aspect-video h-full min-h-32 w-full object-fill md:max-h-48'
          src={post.banner || ''}
          alt=''
        />
      </div>
      <div className='flex-1 bg-background p-2 select-none'>
        <h2 className='text-lg font-bold'>{post.title || 'Untitled'}</h2>
        <p className='mb-2 text-xs sm:line-clamp-2 lg:line-clamp-2'>
          {post.description || 'No description available'}
        </p>
        {showMeta && (
          <div className='flex items-center justify-between'>
            <Badge className='uppercase' variant='outline'>
              {post.published ? 'Published' : 'Draft'}
            </Badge>
            <TimeDisplay
              className='text-xs opacity-50'
              value={post.createdAt}
              options={{ format: 'YYYY-MM-DD' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
