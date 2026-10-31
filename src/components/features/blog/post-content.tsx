import { Calendar } from 'lucide-react';

import { PaperImage } from '~/components/features/blog/paper-image';
import { TimeDisplay } from '~/components/ui/time-display';
import type { Props } from '~/pages/(blog)/blog/[id].server';

import { ArticleBody } from './article-body';

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

export function PostContent({ post: data }: Pick<Props, 'post'>) {
  return (
    <div className='post-content'>
      {data?.banner ? (
        <div className='pointer-events-none relative mb-8 aspect-16/10 *:select-none'>
          <PaperImage
            seed={`banner:${data.id}:${data.banner}`}
            className='relative z-2 aspect-16/10 object-cover'
            src={data.banner}
            alt={data.title ?? ''}
          />
          <img
            className='pointer-events-none absolute top-10 left-0 z-1 aspect-16/10 rounded-xs object-cover opacity-30 blur-3xl'
            src={data.banner}
            alt={data.title ?? ''}
          />
        </div>
      ) : null}
      <div className='mt-12 mb-8'>
        <h1 className='article-title mb-6'>{data?.title}</h1>
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
        <div className='tiptap ProseMirror'>
          <ArticleBody html={data?.htmlContent || ''} imageSeed={data.id} />
        </div>
      </div>
    </div>
  );
}
