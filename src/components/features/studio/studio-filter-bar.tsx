import { RotateCcwIcon, SearchIcon, XIcon } from 'lucide-react';
import type React from 'react';

import { Button } from '~/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group';
import { cn } from '~/lib/utils';

export function StudioPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div>
        <h1 className='text-lg font-medium text-foreground'>{title}</h1>
        {description ? <p className='text-xs text-muted-foreground'>{description}</p> : null}
      </div>
      {actions ? <div className='flex flex-wrap items-center gap-2'>{actions}</div> : null}
    </div>
  );
}

export function StudioFilterBar({
  children,
  actions,
  totalCount,
  filteredCount,
  unit = '项',
  hasActiveFilters = false,
  onReset,
  className,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  totalCount?: number;
  filteredCount?: number;
  unit?: string;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
      {hasActiveFilters && onReset ? (
        <Button type='button' size='sm' variant='ghost' onClick={onReset}>
          <RotateCcwIcon className='size-3.5' />
          重置
        </Button>
      ) : null}
      {totalCount !== undefined ? (
        <span className='px-1 text-xs text-muted-foreground tabular-nums'>
          {hasActiveFilters && filteredCount !== undefined
            ? `显示 ${filteredCount} / ${totalCount} ${unit}`
            : `共 ${totalCount} ${unit}`}
        </span>
      ) : null}
      {actions}
    </div>
  );
}

export function StudioSearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <InputGroup className={cn('w-full sm:w-56', className)}>
      <InputGroupAddon align='inline-start'>
        <SearchIcon className='size-3.5 text-muted-foreground' />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value.length > 0 ? (
        <InputGroupAddon align='inline-end'>
          <Button
            type='button'
            size='icon-xs'
            variant='ghost'
            aria-label='清空搜索'
            onClick={() => onChange('')}
          >
            <XIcon className='size-3.5' />
          </Button>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

export function StudioSegmentedFilter<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <div className='inline-flex h-8 items-center gap-0.5 rounded-lg border border-border bg-card/60 p-0.5'>
      {options.map((option) => (
        <Button
          key={option.value}
          type='button'
          size='xs'
          variant={value === option.value ? 'secondary' : 'ghost'}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
