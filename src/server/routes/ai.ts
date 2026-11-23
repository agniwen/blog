import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { env } from '~/lib/env';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

const summarySchema = z.object({
  title: z.string().optional(),
  content: z.string().trim().min(20, '文章内容至少需要 20 个字才能生成摘要').max(50000),
});

export const aiRouter = factory
  .createApp()
  .post('/summary', authMiddleware, zValidator('json', summarySchema), async (c) => {
    if (!env.AI_API_KEY) {
      return c.json(
        { message: '未配置 AI_API_KEY，请在服务端环境变量中配置后再使用 AI 摘要功能' },
        503,
      );
    }

    const { title, content } = c.req.valid('json');
    const baseUrl = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = env.AI_MODEL || 'gpt-4o-mini';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              '你是一位克制、凝练的中文技术与随笔编辑。请为给定文章生成一段 80 到 140 字的中文摘要，客观概括核心观点，不使用标题、列表、引号或营销语气。',
          },
          {
            role: 'user',
            content: `${title ? `标题：${title}\n\n` : ''}正文：\n${content.slice(0, 12000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return c.json(
        { message: `AI 服务请求失败 (${response.status})${errorText ? `: ${errorText.slice(0, 120)}` : ''}` },
        502,
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const summary = payload.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return c.json({ message: 'AI 返回内容为空，请重试' }, 502);
    }

    return c.json(success({ summary }));
  });
