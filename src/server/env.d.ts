import type { S3Client } from '@aws-sdk/client-s3';

import type { Auth } from '~/lib/auth';
import type { Database } from '~/lib/db';

export interface Env {
  Variables: {
    s3: S3Client;
    db: Database;
    user: Auth['$Infer']['Session']['user'] | null;
    session: Auth['$Infer']['Session']['session'] | null;
  };
}
