import { cn } from '~/lib/tiptap-utils';

export type AdminContainerProps = React.ComponentProps<'div'>;
export function AdminContainer(props: AdminContainerProps) {
  const { className, ...restProps } = props;
  return <div className={cn('admin-container pt-2', className)} {...restProps} />;
}
