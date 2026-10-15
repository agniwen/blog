import { defineHandler } from 'void';
import { z } from 'zod';

import { fail, success } from '~/lib/result';
import { fetchOGData } from '~/routes/api/bookmark/_metadata';

export const POST = defineHandler.withValidator({ body: z.object({ url: z.url('Invalid URL') }) })(
  async (c, { body }) => {
    try {
      return success(await fetchOGData(body.url));
    } catch {
      return c.json(fail('Failed to fetch OG data'), 500);
    }
  },
);
