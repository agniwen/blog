import { spawnSync } from 'node:child_process';

import { config } from 'dotenv';

config({ quiet: true });
const names = [
  'BETTER_AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_BUCKET_NAME',
  'CLOUDFLARE_CDN_URL',
];
const missing = names.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing deployment variables: ${missing.join(', ')}`);

// Only the runtime allowlist goes to Cloudflare. Never send the entire .env file.
const secrets = Object.fromEntries(names.map((name) => [name, process.env[name]]));
const result = spawnSync('pnpm', ['exec', 'wrangler', 'secret', 'bulk'], {
  input: JSON.stringify(secrets),
  stdio: ['pipe', 'inherit', 'inherit'],
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
