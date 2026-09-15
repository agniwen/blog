import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { promisify } from 'node:util';
import { EnvHttpProxyAgent, fetch as proxyFetch } from 'undici';
import * as spotifyModule from 'spotify-url-info';
import type { SpotifyUrlInfoModule } from 'spotify-url-info';

import { parseSpotifyTrack } from '../../src/lib/spotify';

const exec = promisify(execFile);

/** Development-only loopback bridge; Cloudflare credentials never enter the Worker/browser. */
export async function startRemoteBridge(account: string, database: string) {
  const capability = randomUUID();
  const dispatcher = new EnvHttpProxyAgent();
  let credentials: { token: string; expires: number } | undefined;
  let authenticating: Promise<string> | undefined;
  async function token(): Promise<string> {
    if (credentials && credentials.expires > Date.now()) return credentials.token;
    if (authenticating) return authenticating;
    authenticating = (async () => {
      const { stdout } = await exec('bun', ['x', 'wrangler', 'auth', 'token', '--json'], { timeout: 30000 });
      const auth = JSON.parse(stdout.slice(stdout.indexOf('{')));
      const value = auth.token;
      if (typeof value !== 'string' || !value || /\s/.test(value)) throw new Error('Run bun x wrangler login first');
      credentials = { token: value, expires: Date.now() + 600000 };
      return value;
    })();
    try { return await authenticating; } finally { authenticating = undefined; }
  }
  await token();
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'POST' || request.url !== `/${capability}` || request.headers.origin) {
      response.writeHead(403).end(); return;
    }
    try {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 2000000) throw new Error('Request too large');
      }
      const input = JSON.parse(body);
      let result;
      if (input.operation === 'spotify') {
        const link = parseSpotifyTrack(input.url ?? '');
        if (!link) throw new Error('Invalid Spotify URL');
        const factory = (spotifyModule as unknown as { default: SpotifyUrlInfoModule }).default;
        const { getPreview } = factory((async (url: RequestInfo | URL, init?: RequestInit) => {
          return proxyFetch(String(url), { ...init, dispatcher, signal: AbortSignal.timeout(10000), redirect: 'error' } as Parameters<typeof proxyFetch>[1]);
        }) as unknown as typeof fetch);
        const data = await getPreview(link);
        result = { title: data.title, artist: data.artist, image: data.image ?? null, audio: data.audio ?? null, link };
      } else if (input.operation === 'd1' && ['query', 'raw'].includes(input.mode)) {
        const upstream = await proxyFetch(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/${input.mode}`, {
          method: 'POST', dispatcher, signal: AbortSignal.timeout(20000),
          headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(input.statements),
        });
        const data = await upstream.json() as { success: boolean; result: unknown };
        if (upstream.status === 401) credentials = undefined;
        // Never retry mutations after an ambiguous response.
        if (!upstream.ok || !data.success) throw new Error('Remote D1 query failed');
        result = data.result;
      } else throw new Error('Unsupported operation');
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(result));
    } catch {
      response.writeHead(502, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Development connection failed; check network and Wrangler login' }));
    }
  });
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing bridge address');
  return { url: `http://127.0.0.1:${address.port}/${capability}`, close: async () => { server.closeAllConnections(); server.close(); await dispatcher.close(); } };
}
