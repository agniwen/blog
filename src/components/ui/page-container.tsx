import type { PropsWithChildren } from 'react';

import { cn } from '~/lib/utils';

export function PageContainer({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('page-container', className)}>{children}</div>;
}
