import { healthRecords } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const catId = Number(getRouterParam(event, 'id'));
  
  const records = await drizzle.select().from(healthRecords).where(eq(healthRecords.catId, catId));
  return records;
});
