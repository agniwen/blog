import { IconBan, IconRefresh, IconShieldCheck } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { useMemo, useState } from 'react';

import { UsersAdminSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import {
  StudioFilterBar,
  StudioPageHeader,
  StudioSearchInput,
  StudioSegmentedFilter,
} from '~/components/features/studio/studio-filter-bar';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { TimeDisplay } from '~/components/ui/time-display';
import { toastManager } from '~/components/ui/toast';
import { useSession } from '~/lib/auth-client';
import { hono } from '~/lib/hono';

type BanFilter = 'all' | 'active' | 'banned';
type RoleFilter = 'all' | 'admin' | 'reader';
type UserSortOrder = 'created-desc' | 'comments-desc';

export const Route = createFileRoute('/_studio/studio/users')({
  pendingComponent: () => (
    <AdminContainer className='space-y-6'>
      <UsersAdminSkeleton />
    </AdminContainer>
  ),
  component: StudioUsersPage,
});

function StudioUsersPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [banFilter, setBanFilter] = useState<BanFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [sortOrder, setSortOrder] = useState<UserSortOrder>('created-desc');

  const [banTarget, setBanTarget] = useState<{
    id: string;
    name: string;
    currentlyBanned: boolean;
  } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => parseResponse(hono.api.users.$get()),
  });

  const allUsers = data?.data ?? [];

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return allUsers
      .filter((u) => {
        const isBanned = Boolean(u.banned);
        if (banFilter === 'active' && isBanned) return false;
        if (banFilter === 'banned' && !isBanned) return false;
        if (roleFilter === 'admin' && u.role !== 'admin') return false;
        if (roleFilter === 'reader' && u.role === 'admin') return false;
        if (keyword) {
          const haystack = [u.name, u.email].filter(Boolean).join(' ').toLowerCase();
          if (!haystack.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'comments-desc') return b.commentCount - a.commentCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [allUsers, search, banFilter, roleFilter, sortOrder]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    banFilter !== 'all' ||
    roleFilter !== 'all' ||
    sortOrder !== 'created-desc';

  function handleResetFilters() {
    setSearch('');
    setBanFilter('all');
    setRoleFilter('all');
    setSortOrder('created-desc');
  }

  async function handleConfirmBan() {
    if (!banTarget || isSubmitting) return;
    setIsSubmitting(true);
    const nextBanned = !banTarget.currentlyBanned;
    try {
      await parseResponse(
        hono.api.users[':id'].ban.$patch({
          param: { id: banTarget.id },
          json: {
            banned: nextBanned,
            banReason: nextBanned ? banReason.trim() || undefined : undefined,
          },
        }),
      );
      toastManager.add({
        type: 'success',
        title: nextBanned ? `已封禁 ${banTarget.name}` : `已解封 ${banTarget.name}`,
      });
      setBanTarget(null);
      setBanReason('');
      await refetch();
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: error instanceof Error ? error.message : '操作失败',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const roleItems = [
    { value: 'all', label: '全部角色' },
    { value: 'admin', label: '管理员' },
    { value: 'reader', label: '读者' },
  ];

  const sortItems = [
    { value: 'created-desc', label: '最新注册' },
    { value: 'comments-desc', label: '评论最多' },
  ];

  const countMeta = data
    ? hasActiveFilters
      ? `显示 ${filteredUsers.length} / ${allUsers.length} 人`
      : `共 ${allUsers.length} 人`
    : undefined;

  return (
    <AdminContainer className='space-y-6'>
      <StudioPageHeader
        title='用户管理'
        description='查看登录评论用户与封禁状态管理'
        meta={countMeta}
      />

      <div className='space-y-4'>
        <StudioFilterBar
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          actions={
            <Button
              size='sm'
              variant='secondary'
              loading={isFetching && !isLoading}
              onClick={() => void refetch()}
            >
              <IconRefresh className='size-3.5' />
              刷新
            </Button>
          }
        >
          <StudioSearchInput
            value={search}
            onChange={setSearch}
            placeholder='搜索用户名或邮箱...'
          />
          <StudioSegmentedFilter
            value={banFilter}
            onChange={setBanFilter}
            options={[
              { value: 'all', label: '全部' },
              { value: 'active', label: '正常' },
              { value: 'banned', label: '已封禁' },
            ]}
          />
          <Select
            items={roleItems}
            value={roleFilter}
            onValueChange={(value) => setRoleFilter((value as RoleFilter) ?? 'all')}
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {roleItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          <Select
            items={sortItems}
            value={sortOrder}
            onValueChange={(value) => setSortOrder((value as UserSortOrder) ?? 'created-desc')}
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </StudioFilterBar>

        {isLoading && !data ? (
          <UsersAdminSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className='rounded-lg border border-dashed border-border py-14 text-center text-sm text-muted-foreground'>
            {allUsers.length === 0 ? '暂无用户' : '没有符合当前筛选条件的用户'}
          </div>
        ) : (
          <div className='divide-y divide-border rounded-lg border border-border bg-card/60'>
            {filteredUsers.map((user) => {
              const isSelf = user.id === session?.user.id;
              const isBanned = Boolean(user.banned);
              return (
                <div
                  key={user.id}
                  className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <img
                      src={user.image || '/default-avatar.svg'}
                      alt='avatar'
                      className='size-9 shrink-0 rounded-full object-cover'
                    />
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-1.5'>
                        <span className='truncate text-sm font-medium text-foreground'>
                          {user.name}
                        </span>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className='h-4 px-1.5 text-[10px]'
                        >
                          {user.role === 'admin' ? '管理员' : '读者'}
                        </Badge>
                        {isBanned ? (
                          <Badge variant='destructive' className='h-4 px-1.5 text-[10px]'>
                            已封禁
                          </Badge>
                        ) : null}
                      </div>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                        <span className='truncate'>{user.email}</span>
                        <span>· {user.commentCount} 条评论</span>
                        {isBanned && user.banReason ? <span>· 原因：{user.banReason}</span> : null}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <TimeDisplay
                      className='text-xs text-muted-foreground tabular-nums'
                      value={user.createdAt}
                      options={{ format: 'YYYY-MM-DD' }}
                    />
                    <Button
                      type='button'
                      size='xs'
                      variant={isBanned ? 'secondary' : 'ghost'}
                      disabled={isSelf}
                      className={isBanned ? undefined : 'text-destructive hover:text-destructive'}
                      onClick={() => {
                        setBanTarget({
                          id: user.id,
                          name: user.name,
                          currentlyBanned: isBanned,
                        });
                        setBanReason('');
                      }}
                    >
                      {isBanned ? (
                        <>
                          <IconShieldCheck className='size-3.5' />
                          解封
                        </>
                      ) : (
                        <>
                          <IconBan className='size-3.5' />
                          封禁
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(banTarget)}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setBanTarget(null);
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {banTarget?.currentlyBanned
                ? `解封用户 ${banTarget?.name}`
                : `封禁用户 ${banTarget?.name}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banTarget?.currentlyBanned
                ? '解封后该用户将恢复发表评论的权限。'
                : '封禁后该用户将无法在博客发表新评论。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!banTarget?.currentlyBanned ? (
            <div className='py-2'>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder='可选：填写封禁原因（如：垃圾评论）'
              />
            </div>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant='ghost' />}>取消</AlertDialogClose>
            <Button
              variant={banTarget?.currentlyBanned ? 'default' : 'destructive'}
              loading={isSubmitting}
              onClick={handleConfirmBan}
            >
              {banTarget?.currentlyBanned ? '确认解封' : '确认封禁'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </AdminContainer>
  );
}
