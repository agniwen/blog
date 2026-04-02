import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { ScrollArea } from '~/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { auth } from '~/lib/auth';

import { AppSidebar } from './_components/app-sidebar';
import { AppThemeToggle } from './_components/app-theme-toggle';

export default async function StudioLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.role !== 'admin') {
    redirect('/');
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex items-center justify-between border-b p-2'>
          <div>
            <SidebarTrigger className='-ml-1' />
          </div>
          <div className='flex items-center gap-2'>
            <AppThemeToggle />
          </div>
        </header>
        <ScrollArea className='max-h-[calc(100vh-66px)] px-2 pb-2'>{children}</ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
