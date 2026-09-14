import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4-mini';

// Keep existing deployment variables; only these public values enter the browser.
export const clientEnv = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_AVATAR_URL: z.string(),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
