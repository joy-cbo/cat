import { users, settings } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const drizzle = await useDb(event);
    const body = await readBody(event);

    if (!body.email || !body.password || !body.name) {
      throw createError({ statusCode: 400, message: '请填写所有必填字段' });
    }

    if (body.password !== body.confirmPassword) {
      throw createError({ statusCode: 400, message: '两次输入的密码不一致' });
    }

    const existingUser = await drizzle.select().from(users).where(eq(users.email, body.email));
    if (existingUser.length > 0) {
      throw createError({ statusCode: 400, message: '该邮箱已被注册' });
    }

    const allUsers = await drizzle.select().from(users);
    const isFirstUser = allUsers.length === 0;

    const regSetting = await drizzle.select().from(settings).where(eq(settings.key, 'registration_open'));
    const registrationOpen = regSetting.length === 0 || regSetting[0].value === 'true';

    if (!isFirstUser && !registrationOpen) {
      throw createError({ statusCode: 403, message: '注册通道已关闭' });
    }

    const passwordHash = await hashPassword(body.password);

    const role = isFirstUser ? 'admin' : 'member';
    const newUser = await drizzle.insert(users).values({
      email: body.email,
      password: passwordHash,
      name: body.name,
      role,
    }).returning();

    if (isFirstUser) {
      await drizzle.insert(settings).values({
        key: 'registration_open',
        value: 'false',
      }).onConflictDoUpdate({
        target: settings.key,
        set: { value: 'false' },
      });
    }

    const config = useRuntimeConfig();
    const token = await signToken(
      { userId: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
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
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role,
      },
      token,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: error.message || '注册失败' });
  }
});
