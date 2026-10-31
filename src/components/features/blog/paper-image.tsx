import type { ComponentProps } from 'react';

import { paperImageStyle } from '~/lib/paper-image-style';
import { cn } from '~/lib/utils';

export function PaperImage({
  seed,
  className,
  style,
  alt = '',
  ...props
}: ComponentProps<'img'> & { seed: string }) {
  return (
    <img
      {...props}
      alt={alt}
      className={cn('paper-image', className)}
      style={{ ...style, ...paperImageStyle(seed) }}
    />
  );
}
