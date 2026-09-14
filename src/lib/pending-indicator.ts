export const PENDING_DELAY_MS = 300;
export const PENDING_MIN_MS = 300;

/** One loading cycle, shared by client queries and tested with a virtual clock. */
export function createPendingIndicator(onChange: (visible: boolean) => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let shownAt: number | undefined;
  return {
    setPending(pending: boolean) {
      clearTimeout(timer);
      if (pending) {
        if (shownAt !== undefined) return;
        timer = setTimeout(() => {
          shownAt = Date.now();
          onChange(true);
        }, PENDING_DELAY_MS);
      } else if (shownAt !== undefined) {
        const remaining = Math.max(0, PENDING_MIN_MS - (Date.now() - shownAt));
        timer = setTimeout(() => {
          shownAt = undefined;
          onChange(false);
        }, remaining);
      }
    },
    dispose() {
      clearTimeout(timer);
    },
  };
}
