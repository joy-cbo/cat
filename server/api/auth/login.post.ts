import { users } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, signToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const drizzle = await useDb(event);
    const body = await readBody(event);

    if (!body.email || !body.password) {
      throw createError({ statusCode: 400, message: '请输入邮箱和密码' });
    }

    const user = await drizzle.select().from(users).where(eq(users.email, body.email));
    if (user.length === 0) {
      throw createError({ statusCode: 401, message: '邮箱或密码错误' });
    }

    const validPassword = await verifyPassword(body.password, user[0].password);
    if (!validPassword) {
      throw createError({ statusCode: 401, message: '邮箱或密码错误' });
    }

    const config = useRuntimeConfig();
    const token = await signToken(
      { userId: user[0].id, email: user[0].email, role: user[0].role },
      config.jwtSecret
    );

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
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
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: error.message || '登录失败' });
  }
});
