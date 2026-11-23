import { z } from 'zod';

export const postsCreateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  banner: z.union([z.url(), z.literal('')]).optional(),
  summary: z.string().optional(),
  published: z.boolean().optional(),
  htmlContent: z.string().optional(),
  textContent: z.string().optional(),
  jsonContent: z.any().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const postsUpdateSchema = postsCreateSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const postsDetailSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
