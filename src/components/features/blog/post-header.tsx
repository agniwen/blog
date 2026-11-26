import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu';
import { Skeleton } from '~/components/ui/skeleton';
import { toastManager } from '~/components/ui/toast';
import { authClient, useSession } from '~/lib/auth-client';
import { clientEnv } from '~/lib/client-env';
import { cn } from '~/lib/utils';

/**
 * 文章页固定顶部导航栏。
 *
 * - 通过 `.home-avatar` 与首页头像共享 View Transition；
 * - 借助顶部 1px 哨兵元素监听滚动：桌面端下拉时向两侧舒展，移动端展示半透明毛玻璃胶囊底板；
 * - 退出登录后只清理管理端私有缓存，保留公开文章/评论/Spotify 缓存以免阅读页闪烁。
 */
export function PostHeader({ title, postId }: { title?: string | null; postId?: string }) {
  const sentinelRef = useRef<React.ComponentRef<'div'>>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    const anchor = sentinelRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const next =
          !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
        setScrolled((previous) => (previous === next ? previous : next));
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return (
            key !== 'post-list' && key !== 'post-detail' && key !== 'comments' && key !== 'spotify'
          );
        },
      });
      await router.invalidate();
      toastManager.add({ type: 'success', title: '已退出登录' });
    } catch {
      toastManager.add({ type: 'error', title: '退出登录失败，请重试' });
    } finally {
      setIsLoggingOut(false);
    }
  }

  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <div ref={sentinelRef} aria-hidden='true' className='pointer-events-none h-px w-full' />
      <header
        className='article-sticky-header pointer-events-none fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 sm:top-[calc(1.25rem+env(safe-area-inset-top))]'
        data-scrolled={scrolled}
      >
        <div
          className={cn(
            'mx-auto flex min-h-10 w-full max-w-[calc(var(--article-width)+var(--article-gutter)*2)] items-center justify-between gap-3 px-4 transition-[max-width,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            scrolled && 'md:max-w-full md:px-6',
          )}
        >
          <div className='pointer-events-auto -ml-2 shrink-0'>
            <Link
              to='/'
              viewTransition
              aria-label='返回首页'
              className={cn(
                'group inline-flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 outline-none hover:bg-foreground/[0.045] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none dark:hover:bg-foreground/[0.08]',
                scrolled &&
                  'max-md:bg-popover/75 max-md:shadow-2xs max-md:ring-1 max-md:ring-border/50 max-md:backdrop-blur-md max-md:hover:bg-popover/90',
              )}
            >
              <span className='relative inline-flex size-6 shrink-0 items-center justify-center'>
                <span className='home-avatar size-6 transition-[opacity,transform] duration-200 group-hover:scale-75 group-hover:opacity-0 group-focus-visible:scale-75 group-focus-visible:opacity-0 group-active:scale-100 group-active:opacity-100 motion-reduce:transition-none'>
                  <img
                    src={clientEnv.NEXT_PUBLIC_AVATAR_URL}
                    className='pointer-events-none size-full shrink-0 rounded-full object-contain'
                    alt='avatar'
                  />
                </span>
                <Icon
                  icon='lucide:arrow-left'
                  aria-hidden='true'
                  className='pointer-events-none absolute size-4 scale-75 text-foreground/85 opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-active:scale-75 group-active:opacity-0 motion-reduce:transition-none'
                />
              </span>
              {title ? (
                <span className='text-left text-sm leading-snug font-medium whitespace-nowrap text-foreground/90'>
                  {title}
                </span>
              ) : (
                <Skeleton className='h-4 w-28 rounded-sm' />
              )}
            </Link>
          </div>

          {user ? (
            <div className='pointer-events-auto shrink-0'>
              <Menu>
                <MenuTrigger
                  aria-label='用户菜单'
                  className={cn(
                    '-mr-1.5 inline-flex size-8 items-center justify-center rounded-lg text-foreground/80 transition-colors duration-200 outline-none hover:bg-foreground/[0.045] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-foreground/[0.045] motion-reduce:transition-none dark:hover:bg-foreground/[0.08] dark:data-popup-open:bg-foreground/[0.08]',
                    scrolled &&
                      'max-md:bg-popover/75 max-md:shadow-2xs max-md:ring-1 max-md:ring-border/50 max-md:backdrop-blur-md max-md:hover:bg-popover/90 max-md:data-popup-open:bg-popover/90',
                  )}
                >
                  <Icon icon='lucide:menu' className='size-4.5' />
                </MenuTrigger>
                <MenuPopup align='end' side='bottom' sideOffset={4} className='min-w-36 rounded-lg'>
                  {isAdmin && postId ? (
                    <MenuItem
                      render={<Link to='/studio/posts/upsert/$id' params={{ id: postId }} />}
                      className='text-sm'
                    >
                      <Icon icon='lucide:pencil' className='size-4' />
                      编辑此文
                    </MenuItem>
                  ) : null}
                  {isAdmin ? (
                    <>
                      <MenuItem render={<Link to='/studio' />} className='text-sm'>
                        <Icon icon='lucide:layout-dashboard' className='size-4' />
                        进入 Studio
                      </MenuItem>
                      <MenuSeparator />
                    </>
                  ) : null}
                  <MenuItem disabled={isLoggingOut} onClick={handleLogout} className='text-sm'>
                    <Icon icon='lucide:log-out' className='size-4' />
                    退出登录
                  </MenuItem>
                </MenuPopup>
              </Menu>
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
}
