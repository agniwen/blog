import {
  IconFileText,
  IconLayoutDashboard,
  IconMessage,
  IconTag,
  IconUsers,
} from '@tabler/icons-react';

export const menus = [
  {
    label: '概览',
    children: [
      {
        label: '仪表盘',
        icon: <IconLayoutDashboard className='size-4' />,
        href: '/studio' as const,
        exact: true,
      },
    ],
  },
  {
    label: '管理',
    children: [
      {
        label: '文章',
        icon: <IconFileText className='size-4' />,
        href: '/studio/posts' as const,
        exact: false,
      },
      {
        label: '标签',
        icon: <IconTag className='size-4' />,
        href: '/studio/tags' as const,
        exact: false,
      },
      {
        label: '评论',
        icon: <IconMessage className='size-4' />,
        href: '/studio/comments' as const,
        exact: false,
      },
      {
        label: '用户',
        icon: <IconUsers className='size-4' />,
        href: '/studio/users' as const,
        exact: false,
      },
    ],
  },
];
