'use client';
import type { posts } from '~/db/schema';
import { Link } from '@tanstack/react-router';
import { PostCard } from '~/components/features/post-card';

interface PostListProps {
  posts: Array<RPCResponse<typeof posts.$inferSelect> | typeof posts.$inferSelect>
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className='grid md:grid-cols-2 grid-cols-1 gap-4 px-4'>
      {posts.map(post => (
        <Link key={post.id} to='/blog/$id' params={{ id: post.id }} preload='render' className='block cursor-default'>
          <PostCard
            post={post}
            showMeta={false}
          />
        </Link>
      ))}
    </div>
  );
}
