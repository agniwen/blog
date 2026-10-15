import { env } from '~/lib/env';
import { getS3Client } from '~/lib/s3';
export async function createUploadUrl(fileName: string, fileType: string) {
  const key = `assets/${fileType}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const [{ PutObjectCommand }, { getSignedUrl }, s3] = await Promise.all([
    import('@aws-sdk/client-s3'),
    import('@aws-sdk/s3-request-presigner'),
    getS3Client(),
  ]);
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { success: true as const, uploadUrl, key, fileUrl: `${env.CLOUDFLARE_CDN_URL}/${key}` };
}
