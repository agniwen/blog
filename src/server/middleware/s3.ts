import { getS3Client } from '~/lib/s3';

import { factory } from '../factory';

export const s3Middleware = factory.createMiddleware(async (c, next) => {
  c.set('s3', await getS3Client());
  return next();
});
