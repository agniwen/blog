import { defineHandler } from 'void';
import { z } from 'zod';

import { createUploadUrl } from '~/routes/api/s3/_presign';

export const POST = defineHandler.withValidator({
  body: z.object({
    fileName: z.string().min(1, '文件名不能为空'),
    fileType: z.string().min(1, '文件类型不能为空'),
  }),
})(async (c, { body }) => {
  try {
    return await createUploadUrl(body.fileName, body.fileType);
  } catch {
    return c.json({ success: false as const, error: '生成上传链接失败' }, 500);
  }
});
