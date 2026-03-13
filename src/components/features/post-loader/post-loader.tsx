import { useId } from 'react';
import ContentLoader, { Code } from 'react-content-loader';

export function PostListLoader() {
  const id = useId();

  return (
    <div className='mt-4'>
      <ContentLoader
        uniqueKey={`${id}-title`}
        viewBox='0 0 400 20'
        className='w-full px-4 pb-6'
        backgroundColor='var(--secondary)'
        foregroundColor='var(--background)'
      >
        <rect x='0' y='0' rx='5' ry='5' width='100' height='20' />
      </ContentLoader>
      <div className='flex flex-wrap'>
        <PostCardLoader />
        <PostCardLoader />
        <PostCardLoader />
        <PostCardLoader />
        <PostCardLoader />
      </div>
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
