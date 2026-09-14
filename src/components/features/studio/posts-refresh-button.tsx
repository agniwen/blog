import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { toastManager } from '~/components/ui/toast';

export function PostsRefreshButton() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch {
      toastManager.add({ type: 'error', title: 'Failed to refresh posts' });
    } finally {
      setIsRefreshing(false);
    }
  }
  return (
    <Button loading={isRefreshing} onClick={handleRefresh} variant='secondary'>
      Refresh
    </Button>
  );
}
