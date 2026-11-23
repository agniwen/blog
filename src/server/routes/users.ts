import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { users } from '~/db/schema';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

const userParamSchema = z.object({
  id: z.string().min(1),
});

const banBodySchema = z.object({
  banned: z.boolean(),
  banReason: z.string().trim().max(200).optional(),
});

export const usersRouter = factory
  .createApp()
  .get('/', authMiddleware, async (c) => {
    const list = await c.var.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      with: {
        comments: {
          columns: { id: true },
        },
      },
    });
    return c.json(
      success(
        list.map(({ comments: userComments, ...user }) => ({
          ...user,
          commentCount: userComments.length,
        })),
      ),
    );
  })
  .patch(
    '/:id/ban',
    authMiddleware,
    zValidator('param', userParamSchema),
    zValidator('json', banBodySchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { banned, banReason } = c.req.valid('json');
      if (id === c.var.user?.id) {
        return c.json({ message: '不能封禁当前登录管理员' }, 400);
      }
      const [updated] = await c.var.db
        .update(users)
        .set({
          banned,
          banReason: banned ? banReason || '违反社区规范' : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          banned: users.banned,
          banReason: users.banReason,
        });
      if (!updated) {
        return c.json({ message: '用户不存在' }, 404);
      }
      return c.json(success(updated));
    },
  );
