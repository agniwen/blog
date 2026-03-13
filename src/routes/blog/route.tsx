import { createFileRoute, Outlet } from '@tanstack/react-router';

import { MotionProvider } from '~/components/provider/motion-provider';
import { ScrollArea } from '~/components/ui/scroll-area';

export const Route = createFileRoute('/blog')({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <MotionProvider>
      <script
        src='https://cloud.umami.is/script.js'
        data-website-id='db54fa9c-6564-4c24-a997-058b8012f7b7'
      />
      <ScrollArea className='h-screen'>
        <Outlet />
      </ScrollArea>
    </MotionProvider>
  );
}
