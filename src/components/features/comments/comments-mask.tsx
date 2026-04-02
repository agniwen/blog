'use client';
import { Icon } from '@iconify/react';
import type { PropsWithChildren } from 'react';

import { Button } from '~/components/ui/button';
import { authClient } from '~/lib/auth-client';
import { cn } from '~/lib/utils';

export function CommentsMask({ children }: PropsWithChildren) {
  const { data, isPending } = authClient.useSession();

  function githubSignIn() {
    authClient.signIn.social({
      provider: 'github',
      callbackURL: location.href,
    });
  }

  if (data?.user || isPending) {
    return children;
  }
  return (
    <div
      className={cn('relative w-full rounded-md', {
        'p-4': !data?.user,
      })}
    >
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-white/20 backdrop-blur-xs'>
        <div className='flex h-full w-full items-center justify-center'>
          <div>
            <div className='pb-4 text-center text-sm'>
              <p className='mb-2!'>使用社交账户登录评论</p>
              <p className='text-xs'>
                如果你没有以下社交帐户，你可以给我
                <a className='text-black underline' href='mailto:wisakura@outlook.com'>
                  写信
                </a>
                交流
              </p>
            </div>
            <div className='p flex items-center justify-center gap-4'>
              <Button onClick={githubSignIn}>
                <Icon className='mr-1 size-4.5' fill='#fff' icon='ri:github-fill' />
                Github
              </Button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
