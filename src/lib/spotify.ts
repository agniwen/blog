export interface SpotifyData {
  title: string;
  artist: string;
  image: string | null;
  link: string;
  audio: string | null;
}

/** Accept track share URLs, Spotify URIs, and the official iframe snippet. */
export function parseSpotifyTrack(input: string): string | null {
  let value = input.trim();
  if (value.length > 8000) return null;
  if (value.startsWith('<')) {
    const iframe = value.match(/^<iframe\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>\s*<\/iframe>$/is);
    if (!iframe) return null;
    value = iframe[2].replaceAll('&amp;', '&');
  }
  const uri = value.match(/^spotify:track:([a-zA-Z0-9]{22})$/);
  if (uri) return `https://open.spotify.com/track/${uri[1]}`;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || url.port || url.username || url.password) return null;
    const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(?:embed\/)?track\/([a-zA-Z0-9]{22})\/?$/);
    return match ? `https://open.spotify.com/track/${match[1]}` : null;
  } catch {
    return null;
  }
}

/** Validate persisted metadata before using URLs in the browser. */
export function spotifySnapshot(value: unknown, link: string): SpotifyData | undefined {
  if (!value || typeof value !== 'object') return;
  const data = value as Partial<SpotifyData>;
  if (data.link !== link || typeof data.title !== 'string' || typeof data.artist !== 'string') return;
  const media = (url: unknown) => {
    if (typeof url !== 'string') return null;
    try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : null; } catch { return null; }
  };
  return { title: data.title, artist: data.artist, link, image: media(data.image), audio: media(data.audio) };
}
