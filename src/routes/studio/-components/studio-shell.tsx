import type { PropsWithChildren } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppThemeToggle } from './app-theme-toggle';

export function StudioShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='border-b p-2 flex items-center justify-between'>
          <div>
            <SidebarTrigger className='-ml-1' />
          </div>
          <div className='flex items-center gap-2'>
            <AppThemeToggle />
          </div>
        </header>
        <ScrollArea className='max-h-[calc(100vh-66px)] pb-2 px-2'>
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
