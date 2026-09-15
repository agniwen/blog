import { expect, test } from 'bun:test';
import { parseSpotifyTrack } from '../src/lib/spotify.ts';

const id = '4lriIG2vNqwDWzOj2I9rtj';
const canonical = `https://open.spotify.com/track/${id}`;
test('Spotify share, locale, embed and URI inputs normalize to a track', () => {
  for (const input of [canonical + '?si=test', `https://open.spotify.com/intl-zh/track/${id}`, `https://open.spotify.com/embed/track/${id}?utm_source=generator`, `spotify:track:${id}`, `<iframe src="https://open.spotify.com/embed/track/${id}?a=1&amp;b=2" width="100%"></iframe>`]) expect(parseSpotifyTrack(input)).toBe(canonical);
});
test('only complete Spotify track inputs are accepted', () => {
  for (const input of [`http://open.spotify.com/track/${id}`, `https://open.spotify.com.evil.test/track/${id}`, `https://open.spotify.com@localhost/track/${id}`, `https://open.spotify.com:8443/track/${id}`, `https://open.spotify.com/album/${id}`, 'javascript:alert(1)', 'https://localhost', `listen to ${canonical}`, `<iframe src="${canonical}"></iframe><script>alert(1)</script>`, 'https://open.spotify.com/track/short']) expect(parseSpotifyTrack(input)).toBeNull();
});
