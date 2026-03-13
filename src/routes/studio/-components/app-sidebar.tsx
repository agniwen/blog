import { Link, useLocation } from '@tanstack/react-router';
import { CitrusIcon } from 'lucide-react';

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
import { menus } from '~/const/menu';

import { NavUser } from './app-sidebar-user';

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          render={
            <a href='#'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-md bg-primary/5'>
                <CitrusIcon className='size-5 text-primary' />
              </div>
              <div className='flex-1 text-left text-sm leading-tight font-bold'>BLOG</div>
            </a>
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
                          isActive={pathname === menu.href}
                          render={
                            <Link
                              to={menu.href as '/studio' | '/studio/posts' | '/studio/projects'}
                            >
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
