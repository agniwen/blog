import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4-mini';

const serverSchema = {
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.optional(z.string()),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_ENDPOINT: z.string(),
  R2_BUCKET_NAME: z.string(),
  CLOUDFLARE_CDN_URL: z.string(),
};

const clientSchema = {
  NEXT_PUBLIC_AVATAR_URL: z.string(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
  NEXT_PUBLIC_UMAMI_SHARE_URL: z.string(),
};

export function getServerEnv(runtimeEnv: Record<string, string | undefined> = process.env) {
  return createEnv({
    server: serverSchema,
    clientPrefix: 'NEXT_PUBLIC_',
    client: clientSchema,
    runtimeEnv: {
      ...runtimeEnv,
      ...import.meta.env,
    },
    emptyStringAsUndefined: true,
  });
}

export const clientEnv = createEnv({
  server: {},
  clientPrefix: 'NEXT_PUBLIC_',
  client: clientSchema,
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
