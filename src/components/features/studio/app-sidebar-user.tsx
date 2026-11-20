import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Menu,
  MenuPopup,
  MenuGroup,
  MenuItem,
  MenuGroupLabel,
  MenuSeparator,
  MenuTrigger,
} from '~/components/ui/menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { Skeleton } from '~/components/ui/skeleton';
import { toastManager } from '~/components/ui/toast';
import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { authClient, useSession } from '~/lib/auth-client';

export function NavUser() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isMobile } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending } = useSession();

  const showSkeleton = useDelayedPending(isPending && !data);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
      queryClient.clear();
      await router.invalidate();
      await router.navigate({ to: '/studio/login' });
    } catch {
      toastManager.add({ type: 'error', title: '退出登录失败，请重试' });
    } finally {
      setIsLoggingOut(false);
    }
  }

  if ((isPending && !data) || showSkeleton) {
    return (
      <div
        className='flex h-12 items-center gap-2 p-2'
        role={showSkeleton ? 'status' : undefined}
        aria-label={showSkeleton ? '正在加载账户' : undefined}
      >
        {showSkeleton && (
          <>
            <Skeleton className='size-8 shrink-0 rounded-lg' />
            <div className='flex flex-1 flex-col gap-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-3 w-32' />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={data?.user.image || ''} alt={data?.user.name} />
                  <AvatarFallback className='rounded-lg'>
                    {data?.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{data?.user.name}</span>
                  <span className='truncate text-xs text-muted-foreground'>{data?.user.email}</span>
                </div>
              </SidebarMenuButton>
            }
          />
          <MenuPopup
            align='end'
            className='w-(--anchor-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'top'}
            sideOffset={4}
          >
            <MenuGroup>
              <MenuGroupLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={data?.user.image || ''} alt={data?.user.name} />
                    <AvatarFallback className='rounded-lg'>
                      {data?.user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>{data?.user.name}</span>
                    <span className='truncate text-xs text-muted-foreground'>
                      {data?.user.email}
                    </span>
                  </div>
                </div>
              </MenuGroupLabel>
              <MenuSeparator />
              <MenuItem disabled={isLoggingOut} onClick={handleLogout}>
                Log out
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
