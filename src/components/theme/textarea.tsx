import type { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

export type TextareaProps = ComponentProps<'textarea'>;
export function Textarea(props: TextareaProps) {
  const { className, ...restProps } = props;
  return (
    <textarea
      className={cn(
        'rounded-md border bg-gray-50 px-2.5 py-1.5 text-sm ring-transparent transition focus-visible:border-gray-400 focus-visible:ring-3 focus-visible:ring-gray-200',
        className,
      )}
      {...restProps}
    />
  );
}
