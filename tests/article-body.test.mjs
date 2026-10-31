import { expect, test } from 'bun:test';

import { build } from 'esbuild';
import { parseDocument } from 'htmlparser2';
import { renderToStaticMarkup } from 'react-dom/server';

async function loadArticleBody() {
  const result = await build({
    entryPoints: ['src/components/features/blog/article-body.tsx'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'esm',
    define: { 'process.env.NODE_ENV': '"test"' },
    plugins: [
      {
        name: 'card-boundary',
        setup(build) {
          build.onResolve({ filter: /features\/spotify-card$/ }, () => ({
            path: 'card',
            namespace: 'fixture',
          }));
          build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({
            contents: 'export function SpotifyCard() { return null; }',
          }));
        },
      },
    ],
  });
  return import(
    'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64')
  );
}

test('article parsing works without a DOM under browser export conditions', async () => {
  const { ArticleBody } = await loadArticleBody();
  expect(typeof document).toBe('undefined');
  const resultTree = ArticleBody({
    html: '<p>保留正文</p><iframe src="https://open.spotify.com/embed/track/4lriIG2vNqwDWzOj2I9rtj"></iframe>',
  });
  const nodes = resultTree.props.children;
  expect(nodes[0].type).toBe('p');
  expect(nodes[0].props.children).toBe('保留正文');
  expect(nodes[1].props.url).toBe('https://open.spotify.com/track/4lriIG2vNqwDWzOj2I9rtj');
});

test('article images get distinct, hydration-stable paper edges while retaining their attributes', async () => {
  const { ArticleBody } = await loadArticleBody();
  const html =
    '<a href="/original"><img src="/same.jpg" alt="First" width="640" height="480" loading="lazy" srcset="/small.jpg 320w, /same.jpg 640w" class="rounded-lg" style="max-width:320px"></a><img src="/same.jpg" alt="Second"><span data-type="emoji"><img src="/emoji.svg" alt="Emoji"></span><img class="bookmark-favicon" src="/favicon.ico" alt="Site">';
  const render = (imageSeed) => renderToStaticMarkup(ArticleBody({ html, imageSeed }));
  const first = render('post-a');
  expect(render('post-a')).toBe(first);
  expect(render('post-b')).not.toBe(first);
  const images = [];
  function visit(node) {
    if (node.name === 'img') images.push(node.attribs);
    for (const child of node.children ?? []) visit(child);
  }
  visit(parseDocument(first));
  expect(images).toHaveLength(4);
  expect(images[0].class).toContain('paper-image');
  expect(images[1].class).toContain('paper-image');
  expect(images[0].style.split('--paper-image-mask:')[1]).not.toBe(
    images[1].style.split('--paper-image-mask:')[1],
  );
  expect(images[0].alt).toBe('First');
  expect(images[0].width).toBe('640');
  expect(images[0].height).toBe('480');
  expect(images[0].loading).toBe('lazy');
  expect(images[0].srcset).toBe('/small.jpg 320w, /same.jpg 640w');
  expect(images[0].class).toContain('rounded-lg');
  expect(images[0].style).toContain('max-width:320px');
  expect(first).toContain('href="/original"');
  expect(images[2].class).toBeUndefined();
  expect(images[3].class).toBe('bookmark-favicon');
});
