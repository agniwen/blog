import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { PostHeader } from '~/components/features/blog/post-header';
import { AdminContainer } from '~/components/features/studio/admin-container';
import { Skeleton } from '~/components/ui/skeleton';
import type { PostSummary } from '~/lib/api';

import { PostContentLoader, PostListLoader } from './post-loader';

export function HomeSkeleton() {
  return (
    <div
      className='mx-auto w-full max-w-[30rem] px-5 pt-24 pb-16 sm:pt-36 sm:pb-24'
      role='status'
      aria-label='正在加载首页'
    >
      <div className='flex flex-col items-center' aria-hidden='true'>
        <Skeleton className='size-18 rounded-full' />
        <Skeleton className='mt-5 h-7 w-28 rounded-md' />
        <Skeleton className='mt-2 h-5 w-52 rounded-md' />
        <div className='mt-5 flex h-8 space-x-5'>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className='size-8 rounded-md' />
          ))}
        </div>
      </div>
      <div className='mt-10 sm:mt-12'>
        <PostListLoader />
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  const { id } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const cachedTitle = id
    ? queryClient.getQueryData<PostSummary[]>(['post-list'])?.find((item) => item.id === id)?.title
    : undefined;

  return (
    <div className='article-container pt-20 sm:pt-24' role='status' aria-label='正在加载文章'>
      <PostHeader title={cachedTitle} />
      <PostContentLoader />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div role='status' aria-label='正在加载仪表盘' className='space-y-6'>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className='rounded-lg border border-border bg-card/60 p-4'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-3.5 w-16 rounded-sm' />
              <Skeleton className='size-4 rounded-sm' />
            </div>
            <Skeleton className='mt-3 h-7 w-14 rounded-md' />
            <Skeleton className='mt-2 h-3 w-28 rounded-sm' />
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='rounded-lg border border-border bg-card/60 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <Skeleton className='h-4 w-24 rounded-sm' />
            <Skeleton className='h-3.5 w-14 rounded-sm' />
          </div>
          <div className='divide-y divide-border/60'>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className='flex items-center justify-between gap-3 py-2.5'>
                <Skeleton className='h-4 w-44 rounded-sm' />
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-11 rounded-sm' />
                  <Skeleton className='h-3.5 w-14 rounded-sm' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-lg border border-border bg-card/60 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <Skeleton className='h-4 w-20 rounded-sm' />
            <Skeleton className='h-3.5 w-14 rounded-sm' />
          </div>
          <div className='divide-y divide-border/60'>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className='space-y-1.5 py-2.5'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-3.5 w-20 rounded-sm' />
                  <Skeleton className='h-3 w-12 rounded-sm' />
                </div>
                <Skeleton className='h-3.5 w-full rounded-sm' />
                <Skeleton className='h-3 w-36 rounded-sm' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostsSkeleton() {
  return (
    <div role='status' aria-label='正在加载文章列表' className='space-y-4 pb-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <Skeleton className='h-8 w-full rounded-lg sm:w-56' />
        <Skeleton className='h-8 w-36 rounded-lg' />
        <Skeleton className='h-8 w-32 rounded-lg' />
        <Skeleton className='h-8 w-32 rounded-lg' />
        <Skeleton className='h-8 w-16 rounded-md' />
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4'>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className='overflow-hidden rounded-lg border border-border bg-card/70'>
            <Skeleton className='aspect-video w-full rounded-none' />
            <div className='flex flex-col gap-2 p-3.5'>
              <Skeleton className='h-5 w-3/4 rounded-sm' />
              <Skeleton className='h-3.5 w-full rounded-sm' />
              <Skeleton className='h-3.5 w-4/5 rounded-sm' />
              <div className='mt-2 flex items-center justify-between'>
                <Skeleton className='h-5 w-12 rounded-sm' />
                <Skeleton className='h-3.5 w-20 rounded-sm' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TagsSkeleton() {
  return (
    <div
      role='status'
      aria-label='正在加载标签列表'
      className='divide-y divide-border rounded-lg border border-border bg-card/60'
    >
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className='flex items-center justify-between gap-3 px-4 py-3'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-5 w-16 rounded-sm' />
            <Skeleton className='h-3.5 w-14 rounded-sm' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-3.5 w-20 rounded-sm' />
            <div className='flex items-center gap-1'>
              <Skeleton className='size-6 rounded-md' />
              <Skeleton className='size-6 rounded-md' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommentsAdminSkeleton() {
  return (
    <div role='status' aria-label='正在加载评论列表' className='space-y-3'>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className='space-y-3 rounded-lg border border-border bg-card/60 p-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-center gap-2.5'>
              <Skeleton className='size-8 shrink-0 rounded-full' />
              <div className='space-y-1.5'>
                <Skeleton className='h-4 w-24 rounded-sm' />
                <Skeleton className='h-3 w-48 rounded-sm' />
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <Skeleton className='h-6 w-12 rounded-md' />
              <Skeleton className='h-6 w-12 rounded-md' />
            </div>
          </div>
          <div className='space-y-1.5'>
            <Skeleton className='h-3.5 w-full rounded-sm' />
            <Skeleton className='h-3.5 w-3/4 rounded-sm' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UsersAdminSkeleton() {
  return (
    <div
      role='status'
      aria-label='正在加载用户列表'
      className='divide-y divide-border rounded-lg border border-border bg-card/60'
    >
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className='flex items-center justify-between gap-3 px-4 py-3'>
          <div className='flex items-center gap-3'>
            <Skeleton className='size-9 shrink-0 rounded-full' />
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-24 rounded-sm' />
                <Skeleton className='h-4 w-10 rounded-sm' />
              </div>
              <Skeleton className='h-3 w-48 rounded-sm' />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-3.5 w-20 rounded-sm' />
            <Skeleton className='h-6 w-14 rounded-md' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <AdminContainer role='status' aria-label='正在加载后台' className='space-y-6'>
      <div className='flex items-center justify-between gap-3'>
        <div className='space-y-1.5'>
          <Skeleton className='h-6 w-20 rounded-sm' />
          <Skeleton className='h-3.5 w-44 rounded-sm' />
        </div>
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
      <DashboardSkeleton />
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
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-12 rounded-sm' />
            <Skeleton className='h-44 w-full rounded-lg' />
          </div>
          {[false, false, false, true, true, false].map((multiline, i) => (
            <div key={i} className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-20 rounded-sm' />
              <Skeleton className={multiline ? 'h-20 w-full rounded-lg' : 'h-9 w-full rounded-lg'} />
            </div>
          ))}
        </div>
      </div>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col md:order-1 md:overflow-auto'>
        <div className='flex h-9 items-center justify-between border-b border-border/60 px-4'>
          <Skeleton className='h-3.5 w-36 rounded-sm' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-6 w-18 rounded-md' />
            <Skeleton className='h-6 w-18 rounded-md' />
          </div>
        </div>
        <div className='flex h-12 items-center justify-center gap-2 overflow-hidden border-b px-4'>
          {Array.from({ length: 14 }, (_, i) => (
            <Skeleton key={i} className='size-8 shrink-0 rounded-md' />
          ))}
        </div>
        <div className='article-container flex flex-col gap-4 py-12'>
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
