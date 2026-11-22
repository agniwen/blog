import type { ComponentProps } from 'react';

import { paperImageStyle } from '~/lib/paper-image-style';
import { cn } from '~/lib/utils';

/** 带确定性纸张毛边 SVG mask 的图片组件，需传入唯一 `seed` 以保持水合结果一致。 */
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
