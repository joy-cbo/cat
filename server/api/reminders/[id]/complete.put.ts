import { reminders } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = await useDb(event);
  const id = Number(getRouterParam(event, 'id'));
  
  const updated = await drizzle.update(reminders).set({ done: 1 }).where(eq(reminders.id, id)).returning();
  
  return updated[0];
});
