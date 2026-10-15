import { useRouter } from '@void/react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { toastManager } from '~/components/ui/toast';

export function PostsRefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await router.refresh();
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
