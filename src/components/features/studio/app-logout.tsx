import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { authClient } from '~/lib/auth-client';

export function AppLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-7'
      onClick={async () => {
        await authClient.signOut();
        queryClient.clear();
        await router.invalidate();
        router.navigate({ to: '/studio/login' });
      }}
      data-style='ghost'
    >
      <LogOut className='size-4' />
    </Button>
  );
}
