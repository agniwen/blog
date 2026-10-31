import { Icon } from '@iconify/react';
import { Link } from '@void/react';

import { PostList } from '~/components/features/blog/post-list';
import { Button } from '~/components/ui/button';
import { PageContainer } from '~/components/ui/page-container';

import type { Props } from './index.server';

export default function Blogs({ posts }: Props) {
  return (
    <PageContainer className='article-container pt-12 pb-8'>
      <div className='mb-8'>
        <Button
          render={<Link href='/' />}
          aria-label='返回首页'
          size='icon-sm'
          variant='ghost'
          shape='paper'
          className='text-xl'
        >
          <Icon icon='ri:arrow-left-line' />
        </Button>
      </div>
      <PostList posts={posts} />
    </PageContainer>
  );
}
