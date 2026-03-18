import { useId } from 'react';
import ContentLoader, { Code } from 'react-content-loader';

import { Skeleton } from '~/components/ui/skeleton';

export function PostListLoader() {
  return (
    <div className='grid grid-cols-1 divide-y divide-border/60 px-4'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='px-1 py-3.5'>
          <div className='space-y-3'>
            <Skeleton className='h-5 w-2/5 rounded-md' />
            <div className='flex items-end justify-between gap-12'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-3 w-full rounded-md' />
                <Skeleton className='h-3 w-4/5 rounded-md' />
                <Skeleton className='h-3 w-3/5 rounded-md' />
              </div>
              <Skeleton className='h-3 w-24 shrink-0 rounded-md' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export function PostCardLoader() {
  const id = useId();

  return (
    <ContentLoader
      uniqueKey={`${id}-card`}
      viewBox='0 0 400 300'
      className='w-full px-4 sm:w-1/2'
      backgroundColor='var(--secondary)'
      foregroundColor='var(--background)'
    >
      <circle cx='30' cy='258' r='30' />
      <rect x='75' y='233' rx='4' ry='4' width='100' height='13' />
      <rect x='75' y='260' rx='4' ry='4' width='50' height='8' />
      <rect x='0' y='210' rx='5' ry='5' width='400' height='10' />
      <rect x='0' y='0' rx='5' ry='5' width='400' height='200' />
    </ContentLoader>
  );
}

export function PostLoader() {
  const id = useId();

  return (
    <div>
      <ContentLoader
        uniqueKey={`${id}-hero`}
        viewBox='0 0 500 320'
        className='w-full'
        backgroundColor='var(--secondary)'
        foregroundColor='var(--background)'
      >
        <rect x='3' y='3' rx='10' ry='10' width='500' height='280' />
      </ContentLoader>
      <Code backgroundColor='var(--secondary)' foregroundColor='var(--background)' />
      <Code backgroundColor='var(--secondary)' foregroundColor='var(--background)' />
      <Code backgroundColor='var(--secondary)' foregroundColor='var(--background)' />
      <Code backgroundColor='var(--secondary)' foregroundColor='var(--background)' />
    </div>
  );
}
