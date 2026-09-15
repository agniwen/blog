import { expect, test } from 'bun:test';
import { build } from 'esbuild';

test('article parsing works without a DOM under browser export conditions', async () => {
  const result = await build({
    entryPoints: ['src/components/features/blog/article-body.tsx'], bundle: true,
    write: false, platform: 'browser', format: 'esm',
    define: { 'process.env.NODE_ENV': '"test"' },
    plugins: [{ name: 'card-boundary', setup(build) {
      build.onResolve({ filter: /features\/spotify-card$/ }, () => ({ path: 'card', namespace: 'fixture' }));
      build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: 'export function SpotifyCard() { return null; }' }));
    } }],
  });
  const { ArticleBody } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  expect(typeof document).toBe('undefined');
  const resultTree = ArticleBody({ html: '<p>保留正文</p><iframe src="https://open.spotify.com/embed/track/4lriIG2vNqwDWzOj2I9rtj"></iframe>' });
  const nodes = resultTree.props.children;
  expect(nodes[0].type).toBe('p');
  expect(nodes[0].props.children).toBe('保留正文');
  expect(nodes[1].props.url).toBe('https://open.spotify.com/track/4lriIG2vNqwDWzOj2I9rtj');
});
