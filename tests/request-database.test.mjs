import { expect, test } from 'bun:test';
import { build } from 'esbuild';

test('independently evaluated Worker modules share storage but isolate requests', async () => {
  const result = await build({ entryPoints: ['src/lib/db.ts'], bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external' });
  // Only the context module is under test, not Drizzle's query implementation.
  const source = result.outputFiles[0].text.replace(/import \{ drizzle \} from "drizzle-orm\/d1";/, 'const drizzle = () => {};');
  // Resolve the schema imports through the project bundle so URL imports have no relative paths.
  const a = await import('data:text/javascript;base64,' + Buffer.from(source + '\n// worker-entry').toString('base64'));
  const b = await import('data:text/javascript;base64,' + Buffer.from(source + '\n// reloaded-server-function').toString('base64'));
  expect(a.requestDatabase).toBe(b.requestDatabase);
  expect(() => b.db()).toThrow('only available inside a Worker request');
  const first = { request: 'first' }, second = { request: 'second' };
  await Promise.all([
    a.requestDatabase.run(first, async () => { await new Promise(r => setTimeout(r, 5)); expect(b.db()).toBe(first); }),
    b.requestDatabase.run(second, async () => { await Promise.resolve(); expect(a.db()).toBe(second); }),
  ]);
  expect(() => a.db()).toThrow();
});
