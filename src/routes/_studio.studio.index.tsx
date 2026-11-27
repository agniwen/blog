import { IconFileText, IconMessage, IconTag, IconTypography } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';

import { DashboardSkeleton } from '~/components/features/page-skeletons';
import { AdminContainer } from '~/components/features/studio/admin-container';
import { PostsCreateButton } from '~/components/features/studio/posts-create-button';
import { StudioPageHeader } from '~/components/features/studio/studio-filter-bar';
import { Badge } from '~/components/ui/badge';
import { TimeDisplay } from '~/components/ui/time-display';
import { hono } from '~/lib/hono';

export const Route = createFileRoute('/_studio/studio/')({
  pendingComponent: () => (
    <AdminContainer className='space-y-6'>
      <DashboardSkeleton />
    </AdminContainer>
  ),
  component: StudioDashboardPage,
});

function StudioDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => parseResponse(hono.api.dashboard.$get()),
  });

  const stats = data?.data;

  return (
    <AdminContainer className='space-y-6'>
      <StudioPageHeader
        title='概览'
        description='站内文章、标签、评论与字数统计'
        actions={<PostsCreateButton />}
      />

      {isLoading && !data ? (
        <DashboardSkeleton />
      ) : stats ? (
        <>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <StatCard
              icon={<IconFileText className='size-4 text-muted-foreground' />}
              label='文章总数'
              value={stats.counts.totalPosts}
              hint={`已发布 ${stats.counts.publishedPosts} · 草稿 ${stats.counts.draftPosts}`}
            />
            <StatCard
              icon={<IconMessage className='size-4 text-muted-foreground' />}
              label='评论总数'
              value={stats.counts.totalComments}
              hint={`参与用户 ${stats.counts.totalUsers} 人`}
            />
            <StatCard
              icon={<IconTag className='size-4 text-muted-foreground' />}
              label='标签总数'
              value={stats.counts.totalTags}
              hint='用于文章分类检索'
            />
            <StatCard
              icon={<IconTypography className='size-4 text-muted-foreground' />}
              label='累计字数'
              value={stats.counts.totalWords.toLocaleString()}
              hint='所有文章正文合计'
            />
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <section className='rounded-lg border border-border bg-card/60 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-sm font-medium text-foreground'>最近更新文章</h2>
                <Link
                  to='/studio/posts'
                  className='text-xs text-muted-foreground transition-colors hover:text-foreground'
                >
                  查看全部
                </Link>
              </div>
              {stats.recentPosts.length === 0 ? (
                <p className='py-6 text-center text-xs text-muted-foreground'>暂无文章</p>
              ) : (
                <div className='divide-y divide-border/60'>
                  {stats.recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      to='/studio/posts/upsert/$id'
                      params={{ id: post.id }}
                      className='flex items-center justify-between gap-3 py-2.5 text-sm transition-colors hover:text-foreground'
                    >
                      <span className='truncate font-medium text-foreground/90'>
                        {post.title || '无标题文章'}
                      </span>
                      <div className='flex shrink-0 items-center gap-2'>
                        <Badge
                          variant={post.published ? 'default' : 'outline'}
                          className='text-[11px]'
                        >
                          {post.published ? '已发布' : '草稿'}
                        </Badge>
                        <TimeDisplay
                          className='text-xs text-muted-foreground tabular-nums'
                          value={post.updatedAt}
                          options={{ relative: true }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className='rounded-lg border border-border bg-card/60 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-sm font-medium text-foreground'>最新评论</h2>
                <Link
                  to='/studio/comments'
                  className='text-xs text-muted-foreground transition-colors hover:text-foreground'
                >
                  管理评论
                </Link>
              </div>
              {stats.recentComments.length === 0 ? (
                <p className='py-6 text-center text-xs text-muted-foreground'>暂无评论</p>
              ) : (
                <div className='divide-y divide-border/60'>
                  {stats.recentComments.map((comment) => (
                    <div key={comment.id} className='space-y-1 py-2.5'>
                      <div className='flex items-center justify-between gap-2 text-xs'>
                        <span className='font-medium text-foreground'>
                          {comment.user?.name || '匿名用户'}
                        </span>
                        <TimeDisplay
                          className='text-muted-foreground'
                          value={comment.createdAt}
                          options={{ relative: true }}
                        />
                      </div>
                      <p className='line-clamp-1 text-xs text-muted-foreground'>
                        {comment.content}
                      </p>
                      {comment.post ? (
                        <p className='text-[11px] text-muted-foreground/75'>
                          文章：{comment.post.title || '无标题'}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </AdminContainer>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className='rounded-lg border border-border bg-card/60 p-4'>
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <span>{label}</span>
        {icon}
      </div>
      <div className='mt-2 text-2xl font-medium tracking-tight text-foreground tabular-nums'>
        {value}
      </div>
      <div className='mt-1 text-xs text-muted-foreground/80'>{hint}</div>
    </div>
  );
}
