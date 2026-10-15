// Schema generation uses an isolated local D1 binding, never production data.
import { getPlatformProxy } from 'wrangler';

import { createAuth } from '../src/lib/auth-options';
import { createDatabase } from '../src/lib/db';
const platform = await getPlatformProxy<Cloudflare.Env>({
  configPath: '.void-wrangler.jsonc',
  remoteBindings: false,
});
export const auth = createAuth(createDatabase(platform.env.DB), {
  secret: 'schema-generation-only-not-a-runtime-secret',
  googleClientId: '',
  googleClientSecret: '',
});
await platform.dispose();
