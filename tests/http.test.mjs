import { test } from 'bun:test';
import assert from 'node:assert/strict';

const baseUrl = process.env.TEST_BASE_URL;
async function request(path, expectedStatus, init = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
    ...init,
  });
  assert.equal(response.status, expectedStatus, `${path}: unexpected status`);
  console.log(`PASS ${init.method || 'GET'} ${path}: ${expectedStatus}`);
  return response;
}

test.skipIf(!baseUrl)(
  'HTTP smoke checks against TEST_BASE_URL',
  async () => {
    const home = await (await request('/', 200)).text();
    assert.match(home, /<title>akumanoko<\/title>/);
    assert.doesNotMatch(home, /Switched to client rendering because|Cannot find module/);
    // Font CDN stylesheets may precede the application stylesheet in production.
    const stylesheet = [...home.matchAll(/<link\b[^>]*>/g)]
      .map(([tag]) => (/rel="stylesheet"/.test(tag) ? tag.match(/href="([^"]+)"/)?.[1] : undefined))
      .find((href) => href && new URL(href, baseUrl).origin === new URL(baseUrl).origin);
    assert.ok(stylesheet, 'SSR document must link a stylesheet');
    const cssResponse = await fetch(new URL(stylesheet.replaceAll('&amp;', '&'), baseUrl), {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(cssResponse.status, 200);
    assert.match(cssResponse.headers.get('content-type'), /text\/css/);
    assert.match(await cssResponse.text(), /--color-background/);
    assert.match(home, /Wen(?:&#x27;|&#39;|')s Blog/);
    const list = await (await request('/blog', 200)).text();
    const ids = [
      ...new Set([...list.matchAll(/href="\/blog\/([^"?#]+)"/g)].map((match) => match[1])),
    ];
    const sitemap = await request('/sitemap.xml', 200);
    assert.match(sitemap.headers.get('content-type'), /application\/xml/);
    const xml = await sitemap.text();
    assert.doesNotMatch(xml, /\/studio/);
    for (const id of ids) {
      const article = await (await request(`/blog/${id}`, 200)).text();
      assert.match(article, /<h1[^>]*>[^<]+<\/h1>/);
      assert.match(article, /<meta name="description" content="/);
      assert.match(article, /class="tiptap ProseMirror"/);
      assert.ok(xml.includes(`/blog/${id}</loc>`), 'published article missing from sitemap');
    }
    await request('/blog/migration-smoke-missing-post', 404);
    await request('/migration-smoke-missing-route', 404);
    await request('/studio/projects', 404);
    for (const path of [
      '/studio',
      '/studio/posts',
      '/studio/posts/upsert',
      '/studio/posts/upsert/missing',
    ]) {
      const response = await request(path, 307);
      assert.equal(response.headers.get('location'), '/');
      assert.match(response.headers.get('cache-control'), /no-store/);
    }
    const login = await request('/studio/login', 200);
    assert.match(login.headers.get('cache-control'), /private, no-store/);
    const session = await request('/api/auth/get-session', 200);
    assert.equal(await session.json(), null);
    assert.notEqual(
      session.headers.get('access-control-allow-origin'),
      '*',
      'credentialed auth must not use wildcard CORS',
    );
    // Authorization runs before body validation: these requests must never write data.
    for (const method of ['POST', 'PUT', 'DELETE']) {
      await request(
        method === 'DELETE' ? '/api/posts/migration-smoke-missing-post' : '/api/posts',
        401,
        { method },
      );
    }
    await request('/favicon.ico', 200);
    console.log(`All smoke checks passed (${ids.length} published articles).`);
  },
  60000,
);
