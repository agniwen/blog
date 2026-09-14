// Schema generation uses an isolated local D1 binding, never production data.
import { getPlatformProxy } from 'wrangler';

import { getAuth } from '../src/lib/auth';
import { createDatabase } from '../src/lib/db';
const platform = await getPlatformProxy<Cloudflare.Env>({ remoteBindings: false });
export const auth = getAuth(createDatabase(platform.env.DB));
await platform.dispose();
