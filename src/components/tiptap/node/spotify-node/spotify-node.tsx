import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

import { SpotifyCard } from '~/components/features/spotify-card';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/tiptap/ui-primitive/popover';
import { SpotifyForm } from '~/components/tiptap/ui/spotify-popover/spotify-form';
import { parseSpotifyTrack } from '~/lib/spotify';

export function SpotifyNodeView({ node, editor, getPos, deleteNode }: NodeViewProps) {
  const url = parseSpotifyTrack(node.type.name === 'spotify' ? node.attrs.url : node.attrs.code);
  const [editing, setEditing] = useState(false);
  if (!url) return null;
  const card = <SpotifyCard key={url} url={url} metadata={node.attrs.metadata} />;
  return (
    <NodeViewWrapper className='spotify-node' contentEditable={false}>
      {editor.isEditable ? (
        <Popover open={editing} onOpenChange={setEditing}>
          <div className='relative isolate'>
            <div inert>{card}</div>
            <PopoverTrigger
              aria-label='编辑 Spotify 歌曲'
              className='absolute inset-0 cursor-default rounded-2xl focus-visible:outline-2 focus-visible:outline-ring'
            />
          </div>
          <PopoverContent
            aria-label='编辑 Spotify 歌曲'
            align='start'
            className='max-h-[var(--available-height)] w-80 max-w-[calc(100vw-2rem)] gap-0 overflow-y-auto p-0'
          >
            {editing && (
              <SpotifyForm
                key={url}
                initialUrl={url}
                onCancel={() => setEditing(false)}
                onDelete={() => {
                  setEditing(false);
                  deleteNode();
                }}
                onSave={(nextUrl, metadata) => {
                  const pos = getPos();
                  if (typeof pos !== 'number') return;
                  editor
                    .chain()
                    .focus()
                    .insertContentAt(
                      { from: pos, to: pos + node.nodeSize },
                      { type: 'spotify', attrs: { url: nextUrl, metadata } },
                    )
                    .run();
                  setEditing(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      ) : (
        card
      )}
    </NodeViewWrapper>
  );
}
