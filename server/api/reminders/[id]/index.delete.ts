import { reminders } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = await useDb(event);
  const id = Number(getRouterParam(event, 'id'));
  
  await drizzle.delete(reminders).where(eq(reminders.id, id));
  
  return { message: '删除成功' };
});
