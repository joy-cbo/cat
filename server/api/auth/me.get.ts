import { users } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token');

    if (!token) {
      throw createError({ statusCode: 401, message: '未登录' });
    }

    const decoded = await verifyToken(token, config.jwtSecret);
    if (!decoded) {
      throw createError({ statusCode: 401, message: '登录已过期' });
    }

    const drizzle = await useDb(event);
    const user = await drizzle.select().from(users).where(eq(users.id, decoded.userId));

    if (user.length === 0) {
      throw createError({ statusCode: 401, message: '用户不存在' });
    }

    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 401, message: '登录已过期' });
  }
});
