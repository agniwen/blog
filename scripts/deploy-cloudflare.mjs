import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { parse } from 'jsonc-parser';

const errors = [];
const config = parse(readFileSync('wrangler.jsonc', 'utf8'), errors, { allowTrailingComma: true });
if (errors.length) throw new Error('Invalid wrangler.jsonc configuration.');
const binding = config.d1_databases?.find((item) => item.binding === 'DB');
if (!binding?.database_id || /^0+$/.test(binding.database_id)) {
  throw new Error('Configure the real D1 DB binding before deployment; see docs/cloudflare.md.');
}

for (const args of [
  ['run', 'build:cloudflare'],
  ['x', 'wrangler', 'deploy'],
]) {
  const result = spawnSync('bun', args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
