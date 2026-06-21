import { cats } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  
  const allCats = await drizzle.select().from(cats);
  return allCats;
});
