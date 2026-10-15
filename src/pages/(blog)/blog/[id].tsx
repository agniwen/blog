import { PostContent } from '~/components/features/blog/post-content';
import { PostHeader } from '~/components/features/blog/post-header';
import { Comments } from '~/components/features/comments';
import { PageContainer } from '~/components/ui/page-container';

import type { Props } from './[id].server';

export default function Blog({ post, comments }: Props) {
  return (
    <PageContainer className='article-container pt-12'>
      <PostHeader />
      <PostContent post={post} />
      <Comments id={post.id} comments={comments} />
    </PageContainer>
  );
}
