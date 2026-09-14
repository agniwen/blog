import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canonicalRedirect } from '../src/lib/canonical-redirect.ts';

test('production aliases preserve path and query on the canonical origin', () => {
  for (const host of ['www.akumanoko.com', 'blog.wenhouman.workers.dev']) {
    assert.equal(
      canonicalRedirect(
        `https://${host}/blog/post?from=list&next=%2Fstudio`,
        'https://akumanoko.com',
      ),
      'https://akumanoko.com/blog/post?from=list&next=%2Fstudio',
    );
    assert.equal(
      canonicalRedirect(`https://${host}//example.com/path`, 'https://akumanoko.com'),
      'https://akumanoko.com//example.com/path',
    );
  }
});
test('canonical domain, localhost and preview domains are not redirected', () => {
  for (const origin of [
    'https://akumanoko.com',
    'http://localhost:3000',
    'https://preview-blog.wenhouman.workers.dev',
  ]) {
    assert.equal(canonicalRedirect(origin + '/blog', 'https://akumanoko.com'), null);
  }
  assert.equal(canonicalRedirect('https://www.akumanoko.com/blog', 'http://localhost:3000'), null);
});
