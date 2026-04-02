'use client';
/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

import { TimeDisplay } from '~/components/ui/time-display';

import { getPost } from './actions';

import '~/components/tiptap/node/blockquote-node/blockquote-node.css';
import '~/components/tiptap/node/code-block-node/code-block-node.css';
import '~/components/tiptap/node/horizontal-rule-node/horizontal-rule-node.css';
import '~/components/tiptap/node/list-node/list-node.css';
import '~/components/tiptap/node/image-node/image-node.css';
import '~/components/tiptap/node/iframe-node/iframe-node.css';
import '~/components/tiptap/node/heading-node/heading-node.css';
import '~/components/tiptap/node/paragraph-node/paragraph-node.css';
import '~/components/tiptap/node/bookmark-node/bookmark-node.css';
import '~/components/features/editor/simple-editor.css';

export function PostContent({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['post-detail', id],
    queryFn() {
      return getPost(id);
    },
  });
  return (
    <div className='post-content'>
      {data?.banner ? (
        <div className='pointer-events-none relative mb-8 aspect-16/10 rounded-3xl border border-border bg-border p-0.5 *:select-none'>
          <img
            className='relative z-2 aspect-16/10 rounded-3xl object-cover'
            src={data.banner}
            alt={data.title ?? ''}
          />
        </div>
      ) : null}
      <div className='mt-12 mb-8'>
        <h1 className='mb-6 text-4xl font-bold'>{data?.title}</h1>
        <p className='flex items-center gap-8 text-sm opacity-80'>
          <span className='flex items-center gap-1'>
            <Calendar className='size-4' />
            创建时间
          </span>
          <span>
            <TimeDisplay value={data?.createdAt} options={{ format: 'YYYY年MM月DD日' }} />
          </span>
        </p>
      </div>
      <div>
        <div
          className='tiptap ProseMirror'
          dangerouslySetInnerHTML={{
            __html: data?.htmlContent || '',
          }}
        />
      </div>
    </div>
  );
}
