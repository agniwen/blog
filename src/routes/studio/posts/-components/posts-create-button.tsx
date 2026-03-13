import { useNavigate } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { hono } from '~/lib/hono';

export function PostsCreateButton() {
  const navigate = useNavigate();
  async function handleCreate() {
    try {
      const res = await parseResponse(
        hono.api.posts.$post({
          json: {},
        }),
      );
      if (res.data.id) {
        navigate({ to: '/studio/posts/upsert/$id', params: { id: res.data.id } });
      }
    } catch (err) {
      console.error('Failed to create post', err);
      toast.error('Failed to create post');
    }
  }
  return <Button onClick={handleCreate}>New Post</Button>;
}
