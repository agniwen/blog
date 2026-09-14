import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import { MotionProvider } from '~/components/provider/motion-provider';
import { ScrollArea } from '~/components/ui/scroll-area';
export const Route = createFileRoute('/_blog')({
  component: () => (
    <BlogLayout>
      <Outlet />
    </BlogLayout>
  ),
});
function BlogLayout({ children }: PropsWithChildren) {
  return (
    <MotionProvider>
      <script
        src='https://cloud.umami.is/script.js'
        data-website-id='db54fa9c-6564-4c24-a997-058b8012f7b7'
        defer
      />
      <ScrollArea className='blog-surface h-screen'>{children}</ScrollArea>
    </MotionProvider>
  );
}
