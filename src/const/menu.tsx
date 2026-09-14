import { PencilLine } from 'lucide-react';

export const menus = [
  {
    label: 'Content',
    children: [{ label: 'Posts', icon: <PencilLine />, href: '/studio/posts' as const }],
  },
];
