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
  return (
    <div className='w-full space-y-4 px-4 sm:w-1/2'>
      <Skeleton className='aspect-2/1 w-full rounded-xl' />
      <div className='flex items-center gap-3'>
        <Skeleton className='size-12 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-3 w-2/5 rounded-md' />
          <Skeleton className='h-2.5 w-1/4 rounded-md' />
        </div>
      </div>
    </div>
  );
}

export function PostContentLoader() {
  return (
    <div className='post-content' aria-hidden='true'>
      <Skeleton className='mb-8 aspect-16/10 w-full rounded-3xl' />
      <div className='mt-12 mb-8 space-y-6'>
        <Skeleton className='h-10 w-4/5 rounded-xl' />
        <div className='flex items-center gap-8'>
          <Skeleton className='h-4 w-24 rounded-md' />
          <Skeleton className='h-4 w-28 rounded-md' />
        </div>
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-5 w-full rounded-lg' />
        <Skeleton className='h-5 w-11/12 rounded-lg' />
        <Skeleton className='h-5 w-10/12 rounded-lg' />
        <Skeleton className='my-7 h-28 w-full rounded-2xl' />
        <Skeleton className='h-5 w-full rounded-lg' />
        <Skeleton className='h-5 w-9/12 rounded-lg' />
        <Skeleton className='my-7 h-8 w-2/5 rounded-xl' />
        <Skeleton className='h-5 w-full rounded-lg' />
        <Skeleton className='h-5 w-10/12 rounded-lg' />
        <Skeleton className='h-5 w-7/12 rounded-lg' />
      </div>
    </div>
  );
}

export function CommentsLoader() {
  return (
    <div className='my-12 space-y-5' aria-hidden='true'>
      <div className='flex items-end gap-4'>
        <Skeleton className='size-8 shrink-0 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-3 w-36 rounded-md' />
          <Skeleton className='h-9 w-56 rounded-t-xl rounded-br-xl' />
        </div>
      </div>
      <div className='flex flex-row-reverse items-end gap-4'>
        <Skeleton className='size-8 shrink-0 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='ml-auto h-3 w-32 rounded-md' />
          <Skeleton className='h-9 w-48 rounded-t-xl rounded-bl-xl' />
        </div>
      </div>
    </div>
  );
}

export function PostLoader() {
  return (
    <div aria-hidden='true'>
      <PostContentLoader />
      <CommentsLoader />
    </div>
  );
}
