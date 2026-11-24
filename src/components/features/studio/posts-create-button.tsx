import { useRouter } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { toastManager } from '~/components/ui/toast';
import { hono } from '~/lib/hono';

export function PostsCreateButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  async function handleCreate() {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await parseResponse(
        hono.api.posts.$post({
          json: {},
        }),
      );
      if (res.data.id) {
        await router.navigate({ to: '/studio/posts/upsert/$id', params: { id: res.data.id } });
      }
    } catch (err) {
      console.error('Failed to create post', err);
      toastManager.add({ type: 'error', title: '新建文章失败' });
    } finally {
      setIsCreating(false);
    }
  }
  return (
    <Button size='sm' loading={isCreating} onClick={handleCreate}>
      <Icon icon='lucide:plus' className='size-3.5' />
      新建文章
    </Button>
  );
}
