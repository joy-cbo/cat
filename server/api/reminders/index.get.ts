import { reminders } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const query = getQuery(event);
  const catId = query.catId ? Number(query.catId) : undefined;
  
  let allReminders;
  if (catId) {
    allReminders = await drizzle.select().from(reminders).where(eq(reminders.catId, catId));
  } else {
    allReminders = await drizzle.select().from(reminders);
  }
  
  return allReminders;
});
