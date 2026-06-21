import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: '请选择文件',
    });
  }
  
  const file = formData[0];
  
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: '只支持 JPG、PNG、GIF、WebP 格式',
    });
  }
  
  // 验证文件大小 (5MB)
  if (file.data.length > 5 * 1024 * 1024) {
    throw createError({
      statusCode: 400,
      message: '文件大小不能超过 5MB',
    });
  }
  
  // 生成文件名
  const ext = file.filename?.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  // 保存文件
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  await writeFile(join(uploadDir, filename), file.data);
  
  return {
    url: `/uploads/${filename}`,
    filename,
  };
});
