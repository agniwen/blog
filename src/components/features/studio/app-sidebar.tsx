import { Link } from '@void/react';
import { useRouter } from '@void/react';
import { CitrusIcon } from 'lucide-react';

import { NavUser } from '~/components/features/studio/app-sidebar-user';
import { menus } from '~/components/features/studio/menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';

export function AppSidebar() {
  const pathname = new URL(useRouter().url, 'http://localhost').pathname;

  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          render={
            <Link href='/studio/posts'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-md bg-primary/5'>
                <CitrusIcon className='size-5 text-primary' />
              </div>
              <div className='flex-1 text-left text-sm leading-tight font-medium'>BLOG</div>
            </Link>
          }
        ></SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {menus.map((menuGroup) => {
          return (
            <SidebarGroup key={menuGroup.label}>
              <SidebarGroupLabel>{menuGroup.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuGroup.children.map((menu) => {
                    return (
                      <SidebarMenuItem key={menu.label}>
                        <SidebarMenuButton
                          isActive={pathname === menu.href || pathname.startsWith(`${menu.href}/`)}
                          render={
                            <Link href={menu.href}>
                              {menu.icon}
                              {menu.label}
                            </Link>
                          }
                        ></SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
