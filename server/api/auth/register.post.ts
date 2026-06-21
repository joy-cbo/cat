import { users, settings } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const body = await readBody(event);
  
  // 验证输入
  if (!body.email || !body.password || !body.name) {
    throw createError({
      statusCode: 400,
      message: '请填写所有必填字段',
    });
  }
  
  if (body.password !== body.confirmPassword) {
    throw createError({
      statusCode: 400,
      message: '两次输入的密码不一致',
    });
  }
  
  // 检查邮箱是否已注册
  const existingUser = await drizzle.select().from(users).where(eq(users.email, body.email));
  if (existingUser.length > 0) {
    throw createError({
      statusCode: 400,
      message: '该邮箱已被注册',
    });
  }
  
  // 检查是否是第一个用户（管理员）
  const allUsers = await drizzle.select().from(users);
  const isFirstUser = allUsers.length === 0;
  
  // 检查注册是否开放
  const regSetting = await drizzle.select().from(settings).where(eq(settings.key, 'registration_open'));
  const registrationOpen = regSetting.length === 0 || regSetting[0].value === 'true';
  
  if (!isFirstUser && !registrationOpen) {
    throw createError({
      statusCode: 403,
      message: '注册通道已关闭，请使用邀请码注册',
    });
  }
  
  // 密码加密
  const hashedPassword = await bcrypt.hash(body.password, 10);
  
  // 创建用户
  const role = isFirstUser ? 'admin' : 'member';
  const newUser = await drizzle.insert(users).values({
    email: body.email,
    password: hashedPassword,
    name: body.name,
    role,
  }).returning();
  
  // 如果是第一个用户，关闭注册通道
  if (isFirstUser) {
    await drizzle.insert(settings).values({
      key: 'registration_open',
      value: 'false',
    }).onConflictDoUpdate({
      target: settings.key,
      set: { value: 'false' },
    });
  }
  
  // 生成 JWT
  const config = useRuntimeConfig();
  const token = jwt.sign(
    { userId: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
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
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      role: newUser[0].role,
    },
    token,
  };
});
