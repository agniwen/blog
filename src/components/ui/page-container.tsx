import type { PropsWithChildren } from 'react';

import { cn } from '~/lib/utils';

/** 页面主体内容布局容器，统一挂载 `.page-container` 标识。 */
export function PageContainer({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('page-container', className)}>{children}</div>;
}
