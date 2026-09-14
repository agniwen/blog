import type React from 'react';

import { cn } from '~/lib/utils';

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn(
        'animate-skeleton rounded-xl [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_--alpha(var(--color-accent)/50%)_0_0/200%_100%_fixed] motion-reduce:animate-none dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]',
        className,
      )}
      aria-hidden='true'
      data-slot='skeleton'
      {...props}
    />
  );
}
