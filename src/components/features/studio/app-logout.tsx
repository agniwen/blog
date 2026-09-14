import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { toastManager } from '~/components/ui/toast';
import { authClient } from '~/lib/auth-client';

export function AppLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  return (
    <Button
      aria-label='退出登录'
      loading={isLoggingOut}
      variant='ghost'
      size='icon'
      className='size-7'
      onClick={async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
          const result = await authClient.signOut();
          if (result.error) throw new Error(result.error.message);
          queryClient.clear();
          await router.invalidate();
          await router.navigate({ to: '/studio/login' });
        } catch {
          toastManager.add({ type: 'error', title: '退出登录失败，请重试' });
        } finally {
          setIsLoggingOut(false);
        }
      }}
      data-style='ghost'
    >
      <LogOut className='size-4' />
    </Button>
  );
}
