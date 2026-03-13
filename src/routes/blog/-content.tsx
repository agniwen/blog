import { Calendar } from 'lucide-react';

import { TimeDisplay } from '~/components/ui/time-display';
/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { posts } from '~/db/schema';

// --- Lib ---
import '~/components/tiptap/node/blockquote-node/blockquote-node.css';
import '~/components/tiptap/node/code-block-node/code-block-node.css';
import '~/components/tiptap/node/horizontal-rule-node/horizontal-rule-node.css';
import '~/components/tiptap/node/list-node/list-node.css';
import '~/components/tiptap/node/image-node/image-node.css';
import '~/components/tiptap/node/iframe-node/iframe-node.css';
import '~/components/tiptap/node/heading-node/heading-node.css';
import '~/components/tiptap/node/paragraph-node/paragraph-node.css';
import '~/components/tiptap/node/bookmark-node/bookmark-node.css';
// --- Styles ---
import '~/components/features/editor/simple-editor.css';

interface PostContentProps {
  post: RPCResponse<typeof posts.$inferSelect> | typeof posts.$inferSelect | null;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div className='post-content'>
      {post?.banner ? (
        <div className='pointer-events-none relative mb-8 aspect-16/10 rounded-3xl *:select-none'>
          <img
            className='relative z-2 aspect-16/10 rounded-3xl object-cover'
            src={post.banner}
            alt={post.title ?? ''}
          />
          <img
            className='absolute top-0 left-0 z-1 aspect-16/10 rounded-3xl object-cover opacity-65 blur-xl'
            src={post.banner}
            alt=''
          />
        </div>
      ) : null}
      <div className='mt-12 mb-8'>
        <h1 className='mb-6 text-4xl font-bold'>{post?.title}</h1>
        <p className='flex items-center gap-8 text-sm opacity-80'>
          <span className='flex items-center gap-1'>
            <Calendar className='size-4' />
            创建时间
          </span>
          <span>
            <TimeDisplay value={post?.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
          </span>
        </p>
      </div>
      <div>
        <div
          className='tiptap ProseMirror'
          dangerouslySetInnerHTML={{
            __html: post?.htmlContent || '',
          }}
        />
      </div>
    </div>
  );
}
