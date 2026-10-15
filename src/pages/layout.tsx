import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

import { Background } from '~/components/ui/background';
import { ToastProvider } from '~/components/ui/toast';

import '~/styles/app.css';

export default function RootLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider position='top-center'>
        <div className='relative isolate min-h-svh'>{children}</div>
      </ToastProvider>
      <Background />
    </QueryClientProvider>
  );
}
