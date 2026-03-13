import { useIsClient } from 'foxact/use-is-client';
import { useMemo } from 'react';

import { env } from '~/lib/env';

const umamiShareUrl = env.NEXT_PUBLIC_UMAMI_SHARE_URL;

export function UmamiDashboard() {
  const { src } = useMemo(() => {
    return {
      src: umamiShareUrl,
    };
  }, []);

  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }
  return (
    <iframe
      title='Umami Dashboard'
      src={src}
      sandbox='allow-scripts allow-popups allow-forms'
      referrerPolicy='strict-origin-when-cross-origin'
      className='h-[calc(100vh-4rem)] w-full rounded-md'
    />
  );
}
