import { Music2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/tiptap/ui-primitive/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/tiptap/ui-primitive/popover';
import { useTiptapEditor } from '~/hooks/use-tiptap-editor';

import { SpotifyForm } from './spotify-form';

export function SpotifyButton() {
  const { editor } = useTiptapEditor();
  const [open, setOpen] = useState(false);
  if (!editor) return null;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger nativeButton render={<Button data-style='ghost' aria-label='插入 Spotify 歌曲' title='插入 Spotify 歌曲'><Music2 className='tiptap-button-icon' /></Button>} />
      <PopoverContent className='w-80 max-w-[calc(100vw-2rem)] p-0'>
        <SpotifyForm onCancel={() => setOpen(false)} onSave={(url, metadata) => { editor.chain().focus().setSpotify({ url, metadata }).run(); setOpen(false); }} />
      </PopoverContent>
    </Popover>
  );
}
