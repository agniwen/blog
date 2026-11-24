import { Icon } from '@iconify/react';
import type React from 'react';

import { cn } from '~/lib/utils';

export function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Icon>, 'icon'>): React.ReactElement {
  return (
    <Icon
      icon='lucide:loader-2'
      aria-label='Loading'
      className={cn('animate-spin', className)}
      role='status'
      {...props}
    />
  );
}
