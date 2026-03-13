'use client';

import { useEffect, useState } from 'react';

import { dayjs } from '~/lib/dayjs';

interface TimeDisplayFormatOptions {
  format?: string;
  relative?: boolean;
}

interface TimeDisplayProps {
  value?: Date | number | string | null;
  fallback?: string;
  options?: TimeDisplayFormatOptions;
  className?: string;
}

function formatTime(
  value: Date | number | string | null | undefined,
  options?: TimeDisplayFormatOptions,
) {
  if (value === null || value === undefined) {
    return null;
  }

  const date = dayjs(value);

  if (!date.isValid()) {
    return null;
  }

  if (options?.relative) {
    return date.fromNow();
  }

  return date.format(options?.format || 'YYYY-MM-DD HH:mm:ss');
}

function getDateTime(value: Date | number | string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const date = dayjs(value);

  if (!date.isValid()) {
    return undefined;
  }

  return date.toISOString();
}

export function TimeDisplay({ value, fallback = '-', options, className }: TimeDisplayProps) {
  const [displayValue, setDisplayValue] = useState<string | null>(null);
  const format = options?.format;
  const relative = options?.relative;

  useEffect(() => {
    setDisplayValue(formatTime(value, { format, relative }));
  }, [format, relative, value]);

  return (
    <time className={className} dateTime={getDateTime(value)}>
      {displayValue || fallback}
    </time>
  );
}
