import type { S3Client } from '@aws-sdk/client-s3';

import { env } from '~/lib/env';

let s3Promise: Promise<S3Client> | undefined;

/**
 * 懒加载并复用面向 Cloudflare R2 的 S3Client 单例 Promise。
 *
 * 通过动态 `import('@aws-sdk/client-s3')` 避免非上传请求承担 AWS SDK 的冷启动解析开销。
 */
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
