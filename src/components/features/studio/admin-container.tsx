import { cn } from '~/lib/utils';

export type AdminContainerProps = React.ComponentProps<'div'> & { flush?: boolean };
export function AdminContainer({ className, flush = false, ...props }: AdminContainerProps) {
  return (
    <div
      className={cn('admin-container min-h-0 w-full min-w-0', !flush && 'p-4 md:p-6', className)}
      {...props}
    />
  );
}
