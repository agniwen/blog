import { test } from 'bun:test';
import assert from 'node:assert/strict';

import { build } from 'esbuild';

test('browser auth requests remain same-origin even with a stale build-time URL', async () => {
  const result = await build({
    entryPoints: ['src/lib/auth-client.ts'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'esm',
    plugins: [
      {
        name: 'public-env-fixture',
        setup(builder) {
          builder.onResolve({ filter: /client-env$/ }, () => ({
            path: 'client-env',
            namespace: 'fixture',
          }));
          builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({
            contents:
              'export const clientEnv = { NEXT_PUBLIC_BETTER_AUTH_URL: "https://blog.wenhouman.workers.dev" };',
          }));
        },
      },
    ],
  });
  const oldWindow = globalThis.window;
  const oldFetch = globalThis.fetch;
  const requests = [];
  globalThis.window = {
    location: { origin: 'https://akumanoko.com', href: 'https://akumanoko.com/studio/login' },
  };
  globalThis.fetch = async (input) => {
    requests.push(String(input));
    return Response.json({ url: 'https://accounts.google.com/', redirect: false });
  };
  try {
    const { authClient } = await import(
      'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64')
    );
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/studio',
      disableRedirect: true,
    });
    assert.equal(requests.length, 1);
    assert.equal(requests[0], 'https://akumanoko.com/api/auth/sign-in/social');
  } finally {
    globalThis.window = oldWindow;
    globalThis.fetch = oldFetch;
  }
});
