import { useEffect, useRef, useState } from 'react';

import { createPendingIndicator } from '~/lib/pending-indicator';

export function useDelayedPending(pending: boolean) {
  const [visible, setVisible] = useState(false);
  const indicator = useRef<ReturnType<typeof createPendingIndicator> | null>(null);
  useEffect(() => {
    const current = createPendingIndicator(setVisible);
    indicator.current = current;
    return () => current.dispose();
  }, []);
  useEffect(() => {
    indicator.current?.setPending(pending);
  }, [pending]);
  return visible;
}
