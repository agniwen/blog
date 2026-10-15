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
        <Link href='/' aria-label='返回首页'>
          <Button size='icon-sm' variant='ghost' className='text-xl'>
            <Icon icon='ri:arrow-left-line' />
          </Button>
        </Link>
      </div>
      <PostList posts={posts} />
    </PageContainer>
  );
}
