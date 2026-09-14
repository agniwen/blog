import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import { AppSidebar } from '~/components/features/studio/app-sidebar';
import { AppThemeToggle } from '~/components/features/studio/app-theme-toggle';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { getSession } from '~/server/functions';

export const Route = createFileRoute('/_studio')({
  beforeLoad: async () => {
    if ((await getSession())?.user.role !== 'admin')
      throw redirect({ to: '/', headers: { 'Cache-Control': 'private, no-store' } });
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  component: Studio,
});
function Studio() {
  return (
    <StudioLayout>
      <Outlet />
    </StudioLayout>
  );
}

function StudioLayout({ children }: PropsWithChildren) {
  const isEditor = useLocation({
    select: (location) => location.pathname.startsWith('/studio/posts/upsert/'),
  });
  return (
    <SidebarProvider className='h-svh min-h-0 overflow-hidden'>
      <AppSidebar />
      <SidebarInset className='min-h-0 min-w-0 overflow-hidden'>
        <header className='flex h-12 shrink-0 items-center justify-between border-b px-4 md:px-6'>
          <div className='flex min-w-0 items-center gap-3'>
            <SidebarTrigger className='-ml-1' />
            <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm'>
              <Link
                to='/studio/posts'
                className={isEditor ? 'text-muted-foreground hover:text-foreground' : 'font-medium'}
              >
                Posts
              </Link>
              {isEditor && (
                <>
                  <span className='text-muted-foreground' aria-hidden='true'>
                    /
                  </span>
                  <span>Edit post</span>
                </>
              )}
            </nav>
          </div>
          <div className='flex items-center gap-2'>
            <AppThemeToggle />
          </div>
        </header>
        <div
          className='min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain'
          data-slot='studio-content'
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
