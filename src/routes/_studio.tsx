import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { Icon } from '@iconify/react';
import type { PropsWithChildren } from 'react';

import { StudioSkeleton } from '~/components/features/page-skeletons';
import { AppSidebar } from '~/components/features/studio/app-sidebar';
import { AppThemeToggle } from '~/components/features/studio/app-theme-toggle';
import { Button } from '~/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { fetchSession } from '~/lib/api';

export const Route = createFileRoute('/_studio')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      queryKey: ['studio-session'],
      queryFn: () => fetchSession(),
      staleTime: 30_000,
    });
    if (session?.user.role !== 'admin')
      throw redirect({ to: '/', headers: { 'Cache-Control': 'private, no-store' } });
  },
  head: () => ({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] }),
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  pendingComponent: StudioSkeleton,
  component: Studio,
});

function Studio() {
  return (
    <StudioLayout>
      <Outlet />
    </StudioLayout>
  );
}

function StudioBreadcrumb({ pathname }: { pathname: string }) {
  if (pathname.startsWith('/studio/posts/upsert/')) {
    return (
      <>
        <Link to='/studio/posts' className='text-muted-foreground hover:text-foreground'>
          文章
        </Link>
        <span className='text-muted-foreground' aria-hidden='true'>
          /
        </span>
        <span className='font-medium'>编辑文章</span>
      </>
    );
  }
  if (pathname.startsWith('/studio/posts')) {
    return <span className='font-medium'>文章</span>;
  }
  if (pathname.startsWith('/studio/tags')) {
    return <span className='font-medium'>标签</span>;
  }
  if (pathname.startsWith('/studio/comments')) {
    return <span className='font-medium'>评论</span>;
  }
  if (pathname.startsWith('/studio/users')) {
    return <span className='font-medium'>用户</span>;
  }
  return <span className='font-medium'>仪表盘</span>;
}

function StudioLayout({ children }: PropsWithChildren) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  return (
    <SidebarProvider className='h-svh min-h-0 overflow-hidden'>
      <AppSidebar />
      <SidebarInset className='min-h-0 min-w-0 overflow-hidden'>
        <header className='flex h-12 shrink-0 items-center justify-between border-b px-4 md:px-6'>
          <div className='flex min-w-0 items-center gap-3'>
            <SidebarTrigger className='-ml-1' />
            <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm'>
              <StudioBreadcrumb pathname={pathname} />
            </nav>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='xs'
              render={<Link to='/' />}
              className='text-muted-foreground'
            >
              <Icon icon='lucide:external-link' className='size-3.5' />
              返回博客
            </Button>
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
