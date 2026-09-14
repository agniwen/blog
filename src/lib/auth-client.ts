import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { clientEnv } from './client-env';

export const authClient = createAuthClient({
  // The browser always talks to its own origin, regardless of build-time deployment variables.
  baseURL:
    typeof window === 'undefined' ? clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL : window.location.origin,
  plugins: [adminClient()],
});

export const { signIn, signUp, useSession } = authClient;
