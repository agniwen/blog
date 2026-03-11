'use client';
/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { posts } from '~/db/schema';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
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
  post: RPCResponse<typeof posts.$inferSelect> | typeof posts.$inferSelect | null
}

export function PostContent({ post }: PostContentProps) {
  const createdAt = post?.createdAt ? dayjs(post.createdAt).format('YYYY年MM月DD日') : '-';
  return (
    <div className='post-content '>
      {post?.banner
        ? (
            <div className='mb-8  aspect-16/10  rounded-3xl relative pointer-events-none *:select-none'>
              <img className='object-cover aspect-16/10 rounded-3xl relative z-2' src={post.banner} />
              <img className='object-cover aspect-16/10 rounded-3xl absolute opacity-65 top-0  left-0 blur-xl z-1' src={post.banner} />
            </div>
          )
        : null}
      <div className='mt-12 mb-8'>
        <h1 className='mb-6 text-4xl font-bold'>{post?.title}</h1>
        <p className='flex items-center gap-8 opacity-80 text-sm'>
          <span className='flex items-center gap-1'>
            <Calendar className='size-4' />
            创建时间
          </span>
          <span>
            {createdAt}
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
