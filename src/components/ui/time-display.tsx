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

/**
 * 日期时间展示组件。
 *
 * 刻意在客户端挂载后再通过 `useEffect` 格式化本地可读时间，避免 SSR 时区（UTC）与浏览器时区不一致导致水合报错；
 * 同时始终在 `<time dateTime>` 中输出标准 ISO 时间供语义与无障碍读取。
 */
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
