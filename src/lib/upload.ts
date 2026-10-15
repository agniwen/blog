import { useState } from 'react';
import { fetch as apiFetch } from 'void/client';

/**
 * 使用预签名 URL 上传文件到 R2
 * @param file 要上传的文件
 * @returns 上传成功后的文件 URL
 */
export async function uploadFileToR2(file: File): Promise<string> {
  // 1. 获取预签名 URL
  const data = await apiFetch('/api/s3/presigned-url', {
    method: 'POST',
    body: { fileName: file.name, fileType: file.type },
    retry: 0,
  });

  if (!data.success) {
    const errorMsg =
      'error' in data && typeof data.error === 'string' ? data.error : '获取上传链接失败';
    throw new Error(errorMsg);
  }

  const { uploadUrl, fileUrl } = data;

  // 2. 使用预签名 URL 直接上传文件到 R2
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('文件上传失败');
  }

  // 3. 返回文件的访问 URL
  return fileUrl;
}

/**
 * React 组件使用示例
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const fileUrl = await uploadFileToR2(file);
      setProgress(100);
      return fileUrl;
    } catch (error) {
      console.error('上传失败:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress };
}
