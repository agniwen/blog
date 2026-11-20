import { createFactory } from 'hono/factory';

import type { Env } from '~/server/env';

export const factory = createFactory<Env>();
