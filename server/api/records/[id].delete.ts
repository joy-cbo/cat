import { healthRecords } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const id = Number(getRouterParam(event, 'id'));
  
  await drizzle.delete(healthRecords).where(eq(healthRecords.id, id));
  
  return { message: '删除成功' };
});
