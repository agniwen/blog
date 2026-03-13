import type { S3Client } from '@aws-sdk/client-s3';

import { env } from '~/lib/env';

let s3Promise: Promise<S3Client> | undefined;

export function getS3Client() {
  s3Promise ??= import('@aws-sdk/client-s3').then(({ S3Client }) => {
    return new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  });

  return s3Promise;
}
