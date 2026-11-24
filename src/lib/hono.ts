import { createIsomorphicFn } from '@tanstack/react-start';
import { hc } from 'hono/client';

import type { app } from '~/server';

const _client = hc<typeof app>('/');
export type Client = typeof _client;

const isomorphicFetch = createIsomorphicFn()
  .server(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const [{ getRequest }, { app: serverApp }] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('~/server'),
    ]);

    let origin = 'http://localhost:3000';
    let incomingHeaders: Headers | undefined;
    try {
      const req = getRequest();
      origin = new URL(req.url).origin;
      incomingHeaders = req.headers;
    } catch {
      /* Fallback outside request context. */
    }

    const url =
      typeof input === 'string'
        ? new URL(input, origin).href
        : input instanceof URL
          ? input.href
          : input.url;

    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }
    if (incomingHeaders) {
      for (const name of ['cookie', 'origin', 'sec-fetch-site', 'user-agent']) {
        const value = incomingHeaders.get(name);
        if (value && !headers.has(name)) {
          headers.set(name, value);
        }
      }
    }

    return serverApp.fetch(new Request(url, { ...init, headers }));
  })
  .client((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
      ...init,
      credentials: 'include',
    });
  });

export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<typeof app>(...args);
}

export const hono = hcWithType('/', {
  fetch: isomorphicFetch as typeof fetch,
});
