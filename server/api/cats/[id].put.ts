import { cats } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = await useDb(event);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody(event);
  
  const updated = await drizzle.update(cats).set({
    name: body.name,
    breed: body.breed,
    gender: body.gender,
    birthDate: body.birthDate,
    color: body.color,
    weight: body.weight,
    avatarUrl: body.avatarUrl,
    homeDate: body.homeDate,
    status: body.status,
    chipNumber: body.chipNumber,
    notes: body.notes,
  }).where(eq(cats.id, id)).returning();
  
  return updated[0];
});
