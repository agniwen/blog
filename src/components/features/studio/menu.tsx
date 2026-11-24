import { Icon } from '@iconify/react';

export const menus = [
  {
    label: '概览',
    children: [
      {
        label: '仪表盘',
        icon: <Icon icon='lucide:layout-dashboard' className='size-4'  />,
        href: '/studio' as const,
        exact: true,
      },
    ],
  },
  {
    label: '管理',
    children: [
      { label: '文章', icon: <Icon icon='lucide:file-text' className='size-4'  />, href: '/studio/posts' as const, exact: false },
      { label: '标签', icon: <Icon icon='lucide:tag' className='size-4'  />, href: '/studio/tags' as const, exact: false },
      {
        label: '评论',
        icon: <Icon icon='lucide:message-square' className='size-4'  />,
        href: '/studio/comments' as const,
        exact: false,
      },
      { label: '用户', icon: <Icon icon='lucide:users' className='size-4'  />, href: '/studio/users' as const, exact: false },
    ],
  },
];
