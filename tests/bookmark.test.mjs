import { describe, expect, test } from 'bun:test';

import { assertSafeUrl, extractOgMeta, readResponseBytes } from '../src/lib/bookmark-parser';

describe('assertSafeUrl', () => {
  test('accepts public http/https URLs', () => {
    expect(assertSafeUrl('https://example.com/post').hostname).toBe('example.com');
    expect(assertSafeUrl('http://akumanoko.com').hostname).toBe('akumanoko.com');
  });

  test('rejects non-http protocols and embedded credentials', () => {
    expect(() => assertSafeUrl('file:///etc/passwd')).toThrow();
    expect(() => assertSafeUrl('ftp://example.com/file')).toThrow();
    expect(() => assertSafeUrl('https://user:pass@example.com')).toThrow();
  });

  test('rejects localhost, internal hostnames, and private IP ranges', () => {
    for (const blocked of [
      'http://localhost:3000',
      'http://sub.localhost/admin',
      'http://127.0.0.1:8787',
      'http://10.0.0.1/secret',
      'http://172.16.0.1/',
      'http://192.168.1.1/',
      'http://169.254.169.254/latest/meta-data/',
      'http://metadata.google.internal/computeMetadata/v1/',
      'http://[::1]:8080/',
      'http://[fe80::1]/',
      'http://[::ffff:127.0.0.1]/',
    ]) {
      expect(() => assertSafeUrl(blocked)).toThrow();
    }
  });
});

describe('readResponseBytes', () => {
  test('reads stream within byte limit', async () => {
    const res = new Response('hello world', { headers: { 'content-length': '11' } });
    const bytes = await readResponseBytes(res, 100);
    expect(new TextDecoder().decode(bytes)).toBe('hello world');
  });

  test('rejects responses exceeding declared or streamed byte limit', async () => {
    const bigHeader = new Response('x', { headers: { 'content-length': '9999' } });
    await expect(readResponseBytes(bigHeader, 100)).rejects.toThrow();

    const streamed = new Response('x'.repeat(200));
    await expect(readResponseBytes(streamed, 100)).rejects.toThrow();
  });
});

describe('extractOgMeta', () => {
  test('parses meta tags regardless of attribute order or quotes and resolves relative URLs', () => {
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>Fallback Title</title>
          <meta content='My OG Title' property='og:title'>
          <meta content="Desc from OG" property="og:description" />
          <meta property="og:image" content="/assets/cover.png">
          <meta name="description" content="Fallback desc">
          <link href="/favicon.svg" rel="shortcut icon">
        </head>
      </html>
    `;
    const meta = extractOgMeta(html, 'https://example.com/articles/hello');
    expect(meta).toEqual({
      title: 'My OG Title',
      description: 'Desc from OG',
      image: 'https://example.com/assets/cover.png',
      siteName: undefined,
      favicon: 'https://example.com/favicon.svg',
    });
  });

  test('falls back to title and meta description when OG tags are missing', () => {
    const html = `
      <html>
        <head>
          <title>Plain Page</title>
          <meta name="description" content="Plain Description">
        </head>
      </html>
    `;
    const meta = extractOgMeta(html, 'https://example.com');
    expect(meta.title).toBe('Plain Page');
    expect(meta.description).toBe('Plain Description');
  });
});
