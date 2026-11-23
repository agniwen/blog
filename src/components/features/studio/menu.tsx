import { FileTextIcon, LayoutDashboardIcon, MessageSquareIcon, TagIcon, UsersIcon } from 'lucide-react';

export const menus = [
  {
    label: '概览',
    children: [
      {
        label: '仪表盘',
        icon: <LayoutDashboardIcon />,
        href: '/studio' as const,
        exact: true,
      },
    ],
  },
  {
    label: '管理',
    children: [
      { label: '文章', icon: <FileTextIcon />, href: '/studio/posts' as const, exact: false },
      { label: '标签', icon: <TagIcon />, href: '/studio/tags' as const, exact: false },
      {
        label: '评论',
        icon: <MessageSquareIcon />,
        href: '/studio/comments' as const,
        exact: false,
      },
      { label: '用户', icon: <UsersIcon />, href: '/studio/users' as const, exact: false },
    ],
  },
];
