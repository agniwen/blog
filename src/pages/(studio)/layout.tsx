import { Link, useRouter } from '@void/react';
import type { PropsWithChildren } from 'react';

import { AppSidebar } from '~/components/features/studio/app-sidebar';
import { AppThemeToggle } from '~/components/features/studio/app-theme-toggle';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
export default function StudioLayout({ children }: PropsWithChildren) {
  const isEditor = useRouter().url.pathname.startsWith('/studio/posts/upsert/');
  return (
    <SidebarProvider className='h-svh min-h-0 overflow-hidden'>
      <AppSidebar />
      <SidebarInset className='min-h-0 min-w-0 overflow-hidden'>
        <header className='flex h-12 shrink-0 items-center justify-between border-b px-4 md:px-6'>
          <div className='flex min-w-0 items-center gap-3'>
            <SidebarTrigger className='-ml-1' />
            <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm'>
              <Link
                href='/studio/posts'
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
