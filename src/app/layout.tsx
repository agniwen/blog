import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { QueryClientProvider } from '~/components/provider/query-client-provider';
import { Background } from '~/components/ui/background';

import '~/app/globals.css';

export const metadata: Metadata = {
  title: 'akumanoko',
  description: 'akumanoko',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className='antialiased'>
        <Suspense>
          <QueryClientProvider>{children}</QueryClientProvider>
        </Suspense>
        <Background />
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
