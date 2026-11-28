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
    const [homeResponse, postsResponse] = await Promise.all([
      request('/', 200),
      request('/api/posts/public', 200),
    ]);
    assert.match(homeResponse.headers.get('cache-control'), /\bno-store\b/);
    assert.match(postsResponse.headers.get('cache-control'), /\bno-store\b/);
    const home = await homeResponse.text();
    const { data: posts } = await postsResponse.json();
    assert.match(home, /<html[^>]*\blang="zh-CN"/);
    assert.match(home, /<title>wen<\/title>/);
    assert.match(home, /property="og:image"/);
    assert.match(home, /name="twitter:card"\s+content="summary_large_image"/);
    assert.match(home, /rel="canonical"/);
    assert.match(home, /type="application\/rss\+xml"/);
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
    assert.match(home, /<h1\b[^>]*>Hi, I(?:&#x27;|&#39;|&apos;|')m (?:<!-- -->)?wen<\/h1>/);
    assert.match(home, /home-avatar/);
    assert.match(home, /<a\b[^>]*href="\/rss\.xml"[^>]*aria-label="RSS"/);
    const blogRedirect = await request('/blog', 308);
    assert.equal(blogRedirect.headers.get('location'), '/');
    const ids = [
      ...new Set([...home.matchAll(/href="\/blog\/([^"?#]+)"/g)].map((match) => match[1])),
    ];
    assert.deepEqual(
      ids,
      posts.map((post) => encodeURIComponent(post.id)),
      'SSR must stream the published post list',
    );
    const sitemap = await request('/sitemap.xml', 200);
    assert.match(sitemap.headers.get('content-type'), /application\/xml/);
    const xml = await sitemap.text();
    assert.doesNotMatch(xml, /\/blog<\/loc>/);
    assert.doesNotMatch(xml, /\/studio/);
    for (const { id, banner } of posts) {
      const encodedId = encodeURIComponent(id);
      const [articleResponse, postResponse, commentsResponse] = await Promise.all([
        request(`/blog/${encodedId}`, 200),
        request(`/api/posts/public/${encodedId}`, 200),
        request(`/api/comments/public/${encodedId}`, 200),
      ]);
      for (const response of [articleResponse, postResponse, commentsResponse]) {
        assert.match(response.headers.get('cache-control'), /\bno-store\b/);
      }
      const article = await articleResponse.text();
      assert.match(article, /<h1[^>]*>[^<]+<\/h1>/);
      assert.match(article, /<meta name="description" content="/);
      assert.match(article, /property="og:type"\s+content="article"/);
      assert.match(
        article,
        new RegExp(`property="og:image"[^>]*content="[^"]*\\/og\\?id=${encodedId}`),
      );
      assert.match(article, /name="twitter:card"\s+content="summary_large_image"/);
      assert.match(article, /rel="canonical"/);
      assert.match(article, /class="tiptap ProseMirror"/);
      assert.match(article, /article-sticky-header/);
      assert.match(article, /name="comment"/);
      if (banner) assert.match(article, /<img\b[^>]*data-slot="article-banner-image"/);
      assert.ok(xml.includes(`/blog/${encodedId}</loc>`), 'published article missing from sitemap');
    }
    const homeOg = await request('/og', 200);
    assert.match(homeOg.headers.get('content-type'), /image\/png/);
    assert.match(homeOg.headers.get('cache-control'), /public/);
    const homeOgBytes = new Uint8Array(await homeOg.arrayBuffer());
    assert.deepEqual([...homeOgBytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);

    if (ids.length > 0) {
      const postOg = await request(`/og?id=${encodeURIComponent(ids[0])}`, 200);
      assert.match(postOg.headers.get('content-type'), /image\/png/);
      const postOgBytes = new Uint8Array(await postOg.arrayBuffer());
      assert.deepEqual([...postOgBytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
    }

    const missingOg = await request('/og?id=migration-smoke-missing-post', 404);
    assert.match(missingOg.headers.get('cache-control'), /no-store/);

    const robots = await request('/robots.txt', 200);
    const robotsText = await robots.text();
    assert.match(robotsText, /Disallow:\s*\/studio/);
    assert.match(robotsText, /Sitemap:/);

    const rss = await request('/rss.xml', 200);
    assert.match(rss.headers.get('content-type'), /application\/rss\+xml/);
    const rssXml = await rss.text();
    assert.match(rssXml, /<rss version="2\.0"/);
    assert.doesNotMatch(rssXml, /\/studio/);
    for (const id of ids) {
      assert.ok(rssXml.includes(`/blog/${id}</link>`), 'published article missing from rss');
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
    const loginHtml = await login.text();
    assert.match(loginHtml, /Login to your account/);
    assert.doesNotMatch(loginHtml, /button-paper/);
    const session = await request('/api/auth/get-session', 200);
    assert.match(session.headers.get('cache-control'), /private, no-store/);
    assert.equal(await session.json(), null);
    assert.notEqual(
      session.headers.get('access-control-allow-origin'),
      '*',
      'credentialed auth must not use wildcard CORS',
    );
    // Authorization runs before body validation: these requests must never write data.
    for (const path of ['/api/posts', '/api/s3/presigned-url', '/api/bookmark/fetch-og-data']) {
      const response = await request(path, 401, { method: path === '/api/posts' ? 'GET' : 'POST' });
      assert.match(response.headers.get('cache-control'), /private, no-store/);
    }
    for (const method of ['POST', 'PUT', 'DELETE']) {
      const response = await request(
        method === 'DELETE' ? '/api/posts/migration-smoke-missing-post' : '/api/posts',
        401,
        { method },
      );
      assert.match(response.headers.get('cache-control'), /private, no-store/);
    }
    await request('/api/posts', 403, {
      method: 'POST',
      headers: { Origin: 'https://other.invalid' },
    });
    assert.match(home, /href="\/favicon\.svg"/);
    await request('/favicon.svg', 200);
    console.log(`All smoke checks passed (${ids.length} published articles).`);
  },
  60000,
);
