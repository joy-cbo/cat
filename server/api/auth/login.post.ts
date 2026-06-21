import { users } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const body = await readBody(event);
  
  // 验证输入
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: '请输入邮箱和密码',
    });
  }
  
  // 查找用户
  const user = await drizzle.select().from(users).where(eq(users.email, body.email));
  if (user.length === 0) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误',
    });
  }
  
  // 验证密码
  const validPassword = await bcrypt.compare(body.password, user[0].password);
  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误',
    });
  }
  
  // 生成 JWT
  const config = useRuntimeConfig();
  const token = jwt.sign(
    { userId: user[0].id, email: user[0].email, role: user[0].role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  
  // 设置 cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  
  return {
    user: {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
    },
    token,
  };
});
