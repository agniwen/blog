import { useQueryClient } from '@tanstack/react-query';
import { RefreshCwIcon } from 'lucide-react';
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
      toastManager.add({ type: 'error', title: '刷新文章列表失败' });
    } finally {
      setIsRefreshing(false);
    }
  }
  return (
    <Button size='sm' loading={isRefreshing} onClick={handleRefresh} variant='secondary'>
      <RefreshCwIcon className='size-3.5' />
      刷新
    </Button>
  );
}
