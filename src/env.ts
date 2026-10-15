import { defineEnv, string, url } from 'void/env';

// BETTER_AUTH_URL is a public Worker variable, declared in void.config.ts.
export default defineEnv({
  BETTER_AUTH_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  R2_ACCESS_KEY_ID: string(),
  R2_SECRET_ACCESS_KEY: string(),
  R2_ENDPOINT: url(),
  R2_BUCKET_NAME: string(),
  CLOUDFLARE_CDN_URL: url(),
});
