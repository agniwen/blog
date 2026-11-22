import { useEffect, useRef, useState } from 'react';

import { createPendingIndicator } from '~/lib/pending-indicator';

/**
 * 延迟加载状态 Hook：超过 300ms 才显示骨架屏，并在显现后至少保持 300ms，避免快速加载时界面闪烁。
 */
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
