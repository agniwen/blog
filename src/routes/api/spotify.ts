import * as spotifyModule from 'spotify-url-info';
import type { SpotifyUrlInfoModule } from 'spotify-url-info';
import { defineHandler } from 'void';

// v3.3.3 mistakenly declares its runtime default export as a type.
const spotifyUrlInfo = (spotifyModule as unknown as { default: SpotifyUrlInfoModule }).default;

import { parseSpotifyTrack } from '~/lib/spotify';
import type { SpotifyData } from '~/lib/spotify';

function mediaUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export const GET = defineHandler(async (c) => {
  const link = parseSpotifyTrack(c.req.query('url') ?? '');
  if (!link) return c.json({ error: '请输入有效的 Spotify 歌曲链接' }, 400);
  try {
    const signal = AbortSignal.timeout(10000);
    const { getPreview } = spotifyUrlInfo(async (url: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetch(url, { ...init, signal, redirect: 'manual' });
      if (!response.ok) throw new Error('Spotify upstream unavailable');
      return response;
    });
    const preview = await getPreview(link);
    if (!preview.title) throw new Error('Missing track metadata');
    const data: SpotifyData = {
      title: preview.title,
      artist: preview.artist || '',
      image: mediaUrl(preview.image),
      link,
      audio: mediaUrl(preview.audio),
    };
    c.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return c.json(data);
  } catch {
    return c.json({ error: '暂时无法读取歌曲信息，请重试或在 Spotify 中打开' }, 502);
  }
});
