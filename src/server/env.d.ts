import type { S3Client } from '@aws-sdk/client-s3';

import type { getAuth } from '~/lib/auth';
import type { Database } from '~/lib/db';

export interface Env {
  Variables: {
    s3: S3Client;
    db: Database;
    user: ReturnType<typeof getAuth>['$Infer']['Session']['user'] | null;
    session: ReturnType<typeof getAuth>['$Infer']['Session']['session'] | null;
  };
}
