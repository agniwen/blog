import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import {
  assertSafeUrl,
  extractOgMeta,
  readResponseBytes,
  safeFetch,
} from '~/lib/bookmark-parser';
import { env } from '~/lib/env';
import { fail, success } from '~/lib/result';
import { getS3Client } from '~/lib/s3';
import { authMiddleware } from '~/server/middleware/auth';

import { factory } from '../factory';

const MAX_HTML_BYTES = 1024 * 1024; // 1 MB
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const IMAGE_MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

const urlSchema = z.object({
  url: z.url('Invalid URL'),
});

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
  favicon?: string;
}

/**
 * Download an image from a validated external URL and upload it to R2.
 * Returns the CDN URL of the uploaded image.
 */
async function downloadAndUploadImage(imageUrl: string): Promise<string | undefined> {
  try {
    const response = await safeFetch(imageUrl);
    if (!response.ok) {
      return undefined;
    }

    const rawContentType = response.headers.get('content-type') || '';
    const mimeType = rawContentType.split(';')[0]?.trim().toLowerCase() || '';
    const ext = IMAGE_MIME_EXT[mimeType];
    if (!ext) {
      await response.body?.cancel();
      return undefined;
    }

    const imageBytes = await readResponseBytes(response, MAX_IMAGE_BYTES);
    if (imageBytes.byteLength === 0) {
      return undefined;
    }

    const key = `assets/bookmarks/images/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const [{ PutObjectCommand }, s3] = await Promise.all([
      import('@aws-sdk/client-s3'),
      getS3Client(),
    ]);

    await s3.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: imageBytes,
        ContentType: mimeType,
      }),
    );

    return `${env.CLOUDFLARE_CDN_URL}/${key}`;
  } catch (error) {
    console.error('Error downloading and uploading bookmark image:', error);
    return undefined;
  }
}

async function fetchOGData(url: string): Promise<OGData> {
  const safeUrl = assertSafeUrl(url).href;
  const response = await safeFetch(safeUrl);

  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`Failed to fetch URL (${response.status})`);
  }

  const htmlBytes = await readResponseBytes(response, MAX_HTML_BYTES);
  const html = new TextDecoder().decode(htmlBytes);
  const meta = extractOgMeta(html, response.url || safeUrl);

  let proxyImageUrl = meta.image;
  if (meta.image) {
    const uploadedUrl = await downloadAndUploadImage(meta.image);
    if (uploadedUrl) {
      proxyImageUrl = uploadedUrl;
    }
  }

  return {
    title: meta.title,
    description: meta.description,
    image: proxyImageUrl,
    url: safeUrl,
    siteName: meta.siteName,
    favicon: meta.favicon,
  };
}

export const bookmarkRouter = factory
  .createApp()
  .post('/fetch-og-data', authMiddleware, zValidator('json', urlSchema), async (c) => {
    const { url } = c.req.valid('json');

    try {
      const ogData = await fetchOGData(url);
      return c.json(success(ogData));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch OG data';
      const isClientError =
        message.includes('Only http') ||
        message.includes('Blocked private') ||
        message.includes('credentials');
      return c.json(fail(message), isClientError ? 400 : 500);
    }
  });
