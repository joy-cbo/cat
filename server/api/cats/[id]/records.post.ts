import { healthRecords } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const catId = Number(getRouterParam(event, 'id'));
  const body = await readBody(event);
  
  const newRecord = await drizzle.insert(healthRecords).values({
    catId,
    type: body.type,
    date: body.date,
    vaccineName: body.vaccineName,
    batchNumber: body.batchNumber,
    hospital: body.hospital,
    nextDate: body.nextDate,
    medicineName: body.medicineName,
    dosage: body.dosage,
    diagnosis: body.diagnosis,
    prescription: body.prescription,
    cost: body.cost,
    notes: body.notes,
  }).returning();
  
  return newRecord[0];
});
