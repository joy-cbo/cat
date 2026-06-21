import { users } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, 'auth_token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    });
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    const drizzle = await useDb(event);
    
    const user = await drizzle.select().from(users).where(eq(users.id, decoded.userId));
    
    if (user.length === 0) {
      throw createError({
        statusCode: 401,
        message: '用户不存在',
      });
    }
    
    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: '登录已过期，请重新登录',
    });
  }
});
