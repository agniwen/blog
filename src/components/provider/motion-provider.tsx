import { domMax, LazyMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';

export function MotionProvider({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
