'use client';

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';
import type React from 'react';

import { cn } from '~/lib/utils';

export const createPreviewCardHandle: typeof PreviewCardPrimitive.createHandle =
  PreviewCardPrimitive.createHandle;

export const PreviewCardCreateHandle: typeof PreviewCardPrimitive.createHandle =
  PreviewCardPrimitive.createHandle;

export const PreviewCard: typeof PreviewCardPrimitive.Root = PreviewCardPrimitive.Root;

export function PreviewCardTrigger<Payload = unknown>({
  ...props
}: PreviewCardPrimitive.Trigger.Props<Payload>): React.ReactElement {
  return <PreviewCardPrimitive.Trigger data-slot='preview-card-trigger' {...props} />;
}

export function PreviewCardPopup({
  className,
  positionerClassName,
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  anchor,
  portalProps,
  ...props
}: PreviewCardPrimitive.Popup.Props & {
  align?: PreviewCardPrimitive.Positioner.Props['align'];
  side?: PreviewCardPrimitive.Positioner.Props['side'];
  sideOffset?: PreviewCardPrimitive.Positioner.Props['sideOffset'];
  anchor?: PreviewCardPrimitive.Positioner.Props['anchor'];
  positionerClassName?: string;
  portalProps?: PreviewCardPrimitive.Portal.Props;
}): React.ReactElement {
  return (
    <PreviewCardPrimitive.Portal {...portalProps}>
      <PreviewCardPrimitive.Positioner
        align={align}
        anchor={anchor}
        className={cn('z-50', positionerClassName)}
        data-slot='preview-card-positioner'
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          className={cn(
            'relative flex w-64 origin-(--transform-origin) rounded-lg border bg-popover p-4 text-sm text-balance text-popover-foreground shadow-lg/5 transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
            className,
          )}
          data-slot='preview-card-content'
          {...props}
        >
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export {
  PreviewCardPrimitive,
  PreviewCard as HoverCard,
  PreviewCardTrigger as HoverCardTrigger,
  PreviewCardPopup as HoverCardContent,
};
