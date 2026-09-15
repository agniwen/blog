import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { SpotifyCard } from '~/components/features/spotify-card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type { SpotifyData } from '~/lib/spotify';
import { parseSpotifyTrack } from '~/lib/spotify';

export function SpotifyForm({
  initialUrl = '',
  onSave,
  onCancel,
  onDelete,
}: {
  initialUrl?: string;
  onSave: (url: string, metadata?: SpotifyData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const queryClient = useQueryClient();
  const [input, setInput] = useState(initialUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  function parse() {
    const url = parseSpotifyTrack(input);
    setError(url ? '' : '请粘贴 Spotify 歌曲链接、spotify:track URI 或歌曲 iframe 代码');
    return url;
  }
  return (
    <form
      className='flex w-full flex-col gap-3 p-3'
      onSubmit={(event) => {
        event.preventDefault();
        const url = parse();
        if (url) onSave(url, queryClient.getQueryData<SpotifyData>(['spotify-track', url]));
      }}
    >
      <Input
        aria-label='Spotify 歌曲链接或嵌入代码'
        placeholder='https://open.spotify.com/track/…'
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setPreview(null);
          setError('');
        }}
      />
      {error && (
        <p className='text-sm text-destructive-foreground' role='alert'>
          {error}
        </p>
      )}
      {preview && <SpotifyCard key={preview} url={preview} />}
      <div className='flex items-center gap-2'>
        {onDelete && (
          <Button
            type='button'
            size='icon-sm'
            variant='ghost'
            aria-label='删除歌曲'
            title='删除歌曲'
            onClick={onDelete}
          >
            <Trash2 />
          </Button>
        )}
        <div className='ml-auto flex items-center gap-2'>
          <Button type='button' size='sm' variant='outline' onClick={() => setPreview(parse())}>
            预览
          </Button>
          <Button type='button' size='sm' variant='ghost' onClick={onCancel}>
            取消
          </Button>
          <Button type='submit' size='sm'>
            {initialUrl ? '保存' : '插入'}
          </Button>
        </div>
      </div>
    </form>
  );
}
