import { cats } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const drizzle = await useDb(event);
  const body = await readBody(event);
  
  const newCat = await drizzle.insert(cats).values({
    name: body.name,
    breed: body.breed,
    gender: body.gender,
    birthDate: body.birthDate,
    color: body.color,
    weight: body.weight,
    avatarUrl: body.avatarUrl,
    homeDate: body.homeDate,
    status: body.status || 'active',
    chipNumber: body.chipNumber,
    notes: body.notes,
    ownerId: body.ownerId,
  }).returning();
  
  return newCat[0];
});
