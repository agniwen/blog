'use client';

import { SiSpotify } from '@icons-pack/react-simple-icons';
// Installed from @spell/spotify-card (https://spell.sh/docs/spotify-card).
// Local adaptations: query/snapshot loading, theme tokens, accessible playback,
// unique SVG IDs for multiple tracks, and article typography isolation.
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useId } from 'react';

import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { parseSpotifyTrack, spotifySnapshot } from '~/lib/spotify';
import type { SpotifyData } from '~/lib/spotify';
import { cn } from '~/lib/utils';

import './features/spotify-card.css';

interface SpotifyCardProps {
  url: string;
  metadata?: SpotifyData;
  className?: string;
}

const SpotifyCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative flex h-full max-h-[100px] w-full items-stretch justify-center overflow-hidden rounded-2xl border border-border bg-muted/50 p-3',
      className,
    )}
  >
    <div className='aspect-square w-full max-w-[75px] animate-pulse self-center rounded-lg bg-muted' />
    <div className='z-10 flex w-full flex-col justify-end'>
      <div className='flex flex-col items-end gap-1 pl-6'>
        <div className='h-4 w-24 animate-pulse rounded bg-muted' />
        <div className='h-4 w-16 animate-pulse rounded bg-muted' />
      </div>
    </div>
  </div>
);

const SpotifyCardError = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'flex h-[100px] w-full items-center justify-center rounded-2xl border border-border bg-muted/50 p-6 text-muted-foreground',
      className,
    )}
  >
    <p className='text-sm'>Failed to load Spotify data</p>
  </div>
);

export function SpotifyCard({ url, className, metadata }: SpotifyCardProps) {
  const link = parseSpotifyTrack(url);
  const snapshot = link ? spotifySnapshot(metadata, link) : undefined;
  const {
    data,
    isPending: isLoading,
    isError: error,
  } = useQuery({
    queryKey: ['spotify-track', link],
    initialData: snapshot,
    enabled: !!link && !snapshot,
    staleTime: 3600000,
    retry: 1,
    queryFn: async ({ signal }): Promise<SpotifyData> => {
      const response = await fetch(`/api/spotify?url=${encodeURIComponent(link!)}`, { signal });
      if (!response.ok) throw new Error('Spotify metadata unavailable');
      return response.json();
    },
  });
  const pending = useDelayedPending(isLoading);
  const svgId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = null;
    setIsPlaying(false);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [data?.audio]);

  const handlePlayPause = async () => {
    if (!data?.audio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(data.audio);
      audioRef.current.volume = 0.3;
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setPlayError(false);
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setPlayError(true);
        setIsPlaying(false);
      }
    }
  };

  if (isLoading) {
    return pending ? (
      <SpotifyCardSkeleton className={className} />
    ) : (
      <div className='h-[100px]' aria-busy='true' />
    );
  }

  if (error || !data) {
    return <SpotifyCardError className={className} />;
  }

  return (
    <div
      className={cn(
        'spell-spotify-card relative isolate my-4 flex h-[100px] w-full items-stretch justify-center overflow-hidden rounded-2xl border border-border bg-card p-3',
        className,
      )}
    >
      <div className='pointer-events-none absolute top-1/2 left-1/2 z-0 block aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2'>
        <div className='pointer-events-none flex h-full opacity-100 select-none'>
          <img
            src={data.image ?? undefined}
            alt=''
            className='absolute top-0 left-0 block h-full w-full blur-[50px] brightness-150'
          />
          <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-b from-card/20 to-card/90' />
        </div>
      </div>
      <button
        type='button'
        aria-label={`${isPlaying ? '暂停' : '试听'} ${data.title}`}
        aria-pressed={isPlaying}
        disabled={!data.audio}
        onClick={data.audio ? handlePlayPause : undefined}
        className={cn('group relative z-[1] w-full max-w-[75px] self-center', 'cursor-default')}
      >
        <img
          src={data.image ?? undefined}
          alt={data.title}
          className={cn(
            'pointer-events-none relative z-[1] min-h-[75px] w-full min-w-[75px] rounded-lg object-cover shadow-md transition-transform duration-300 ease-out select-none',
            data.audio && 'group-hover:-translate-x-0.5',
            isPlaying && '-translate-x-0.5',
          )}
        />
        {data.audio && (
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -z-[1] size-[80%] -translate-y-1/2 transition-all duration-300',
              isPlaying
                ? 'translate-x-[-10%]'
                : 'translate-x-[-50%] group-hover:translate-x-[-10%]',
            )}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 110 110'
              className='size-full animate-spin'
              style={{
                animationDuration: '3s',
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <circle cx='55' cy='55' r='55' fill='#000' />
              <mask
                id={`${svgId}-mask0_6138_16576`}
                width='110'
                height='110'
                x='0'
                y='0'
                maskUnits='userSpaceOnUse'
                style={{ maskType: 'alpha' }}
              >
                <circle cx='55' cy='55' r='55' fill='#000' />
              </mask>
              <g mask={`url(#${svgId}-mask0_6138_16576)`}>
                <g filter={`url(#${svgId}-filter0_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='51.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter1_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='47.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter2_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='45.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter3_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='43.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter4_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='37.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter5_f_6138_16576)`}>
                  <circle cx='55' cy='55' r='34.5' stroke='#fff' strokeOpacity='0.21' />
                </g>
                <g filter={`url(#${svgId}-filter6_f_6138_16576)`} opacity='0.4'>
                  <path fill='#fff' d='M-14 38l68 19.579L-14 74V38z' />
                </g>
                <g filter={`url(#${svgId}-filter7_f_6138_16576)`} opacity='0.4'>
                  <path fill='#fff' d='M123 38L55 57.579 123 74V38z' />
                </g>
                <g filter={`url(#${svgId}-filter8_f_6138_16576)`} opacity='0.4'>
                  <path fill='#fff' d='M36.5 124.5l19.579-68 16.421 68h-36z' />
                </g>
                <g filter={`url(#${svgId}-filter9_f_6138_16576)`} opacity='0.4'>
                  <path fill='#fff' d='M36.5-12.5l19.579 68 16.421-68h-36z' />
                </g>
              </g>
              <defs>
                <filter
                  id={`${svgId}-filter0_f_6138_16576`}
                  width='108'
                  height='108'
                  x='1'
                  y='1'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter1_f_6138_16576`}
                  width='100'
                  height='100'
                  x='5'
                  y='5'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter2_f_6138_16576`}
                  width='96'
                  height='96'
                  x='7'
                  y='7'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter3_f_6138_16576`}
                  width='92'
                  height='92'
                  x='9'
                  y='9'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter4_f_6138_16576`}
                  width='80'
                  height='80'
                  x='15'
                  y='15'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter5_f_6138_16576`}
                  width='74'
                  height='74'
                  x='18'
                  y='18'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='1' />
                </filter>
                <filter
                  id={`${svgId}-filter6_f_6138_16576`}
                  width='100'
                  height='68'
                  x='-30'
                  y='22'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='8' />
                </filter>
                <filter
                  id={`${svgId}-filter7_f_6138_16576`}
                  width='100'
                  height='68'
                  x='39'
                  y='22'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='8' />
                </filter>
                <filter
                  id={`${svgId}-filter8_f_6138_16576`}
                  width='68'
                  height='100'
                  x='20.5'
                  y='40.5'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='8' />
                </filter>
                <filter
                  id={`${svgId}-filter9_f_6138_16576`}
                  width='68'
                  height='100'
                  x='20.5'
                  y='-28.5'
                  colorInterpolationFilters='sRGB'
                  filterUnits='userSpaceOnUse'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                  <feGaussianBlur result='effect1_foregroundBlur_6138_16576' stdDeviation='8' />
                </filter>
              </defs>
            </svg>
          </div>
        )}
      </button>
      <div className='z-10 flex w-full min-w-0 flex-col justify-between'>
        <div className='flex self-end'>
          <a
            href={data.link}
            target='_blank'
            rel='noopener noreferrer'
            className='cursor-pointer'
            aria-label={`在 Spotify 中打开 ${data.title}`}
          >
            <SiSpotify size={18} className='text-muted-foreground' />
          </a>
        </div>
        <div className='pl-6 text-end'>
          <div className='truncate text-sm font-medium tracking-[-.006em] text-foreground'>
            {data.title}
          </div>
          <div className='truncate text-sm font-medium tracking-[-.006em] text-muted-foreground'>
            {data.artist}
          </div>
          {playError && (
            <span role='status' className='text-xs text-muted-foreground'>
              试听不可用，请在 Spotify 中打开
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
