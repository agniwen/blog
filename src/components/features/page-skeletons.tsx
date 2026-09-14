import { AdminContainer } from '~/components/admin/admin-container';
import { Skeleton } from '~/components/ui/skeleton';

import { PostContentLoader, PostListLoader } from './post-loader';

function BackSkeleton() {
  return <Skeleton className='size-8 rounded-md' />;
}

export function BlogListSkeleton() {
  return (
    <div className='mx-auto max-w-2xl pt-12 pb-8' role='status' aria-label='正在加载文章列表'>
      <div className='mb-8 px-4'>
        <BackSkeleton />
      </div>
      <PostListLoader />
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className='mx-auto max-w-2xl px-4 pt-12' role='status' aria-label='正在加载文章'>
      <div className='mb-12'>
        <BackSkeleton />
      </div>
      <PostContentLoader />
    </div>
  );
}

export function PostsSkeleton() {
  return (
    <div
      role='status'
      aria-label='正在加载文章卡片'
      className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4 pb-4'
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className='overflow-hidden rounded-xl border border-border'>
          <Skeleton className='aspect-video w-full rounded-none' />
          <div className='flex flex-col gap-2 p-2'>
            <Skeleton className='h-5 w-3/4 rounded-md' />
            <Skeleton className='h-3 w-full rounded-md' />
            <Skeleton className='h-3 w-4/5 rounded-md' />
            <div className='mt-1 flex justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <AdminContainer role='status' aria-label='正在加载后台'>
      <Skeleton className='mb-6 h-9 w-40 rounded-md' />
      <PostsSkeleton />
    </AdminContainer>
  );
}

export function EditorSkeleton() {
  return (
    <div
      role='status'
      aria-label='正在加载编辑器'
      className='flex h-full min-h-0 min-w-0 flex-col overflow-auto md:flex-row md:overflow-hidden'
    >
      <div className='w-full shrink-0 border-b p-4 md:order-2 md:w-xs md:overflow-auto md:border-b-0 md:border-l'>
        <div className='flex flex-col gap-7'>
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-48 w-full rounded-md' />
          </div>
          {[false, false, true, true, false].map((multiline, i) => (
            <div key={i} className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className={multiline ? 'h-24 w-full' : 'h-9 w-full'} />
            </div>
          ))}
        </div>
      </div>
      <div className='min-h-0 min-w-0 flex-1 md:order-1 md:overflow-auto'>
        <div className='flex h-12 items-center justify-center gap-2 overflow-hidden border-b px-4'>
          {Array.from({ length: 14 }, (_, i) => (
            <Skeleton key={i} className='size-8 shrink-0 rounded-md' />
          ))}
        </div>
        <div className='mx-auto flex max-w-[648px] flex-col gap-4 px-6 py-12 md:px-12'>
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton
              key={i}
              className={i % 3 === 2 ? 'mb-4 h-4 w-3/4 rounded-md' : 'h-4 w-full rounded-md'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <div
      className='flex min-h-svh items-center justify-center p-6 md:p-10'
      role='status'
      aria-label='正在加载登录页'
    >
      <div className='flex w-full max-w-xs flex-col gap-6'>
        <Skeleton className='mx-auto h-7 w-36' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-9 w-full' />
        <Skeleton className='h-9 w-full' />
        <Skeleton className='h-9 w-full rounded-md' />
      </div>
    </div>
  );
}
