import { action } from '@void/react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { toastManager } from '~/components/ui/toast';
export function PostsCreateButton() {
  const [isCreating, setIsCreating] = useState(false);
  async function handleCreate() {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const result = await action('/studio/posts?create');
      if (!result.ok) throw new Error(result.error.message);
    } catch (err) {
      console.error('Failed to create post', err);
      toastManager.add({ type: 'error', title: 'Failed to create post' });
    } finally {
      setIsCreating(false);
    }
  }
  return (
    <Button loading={isCreating} onClick={handleCreate}>
      New Post
    </Button>
  );
}
