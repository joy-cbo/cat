import { healthRecords } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody(event);
  
  const updated = await drizzle.update(healthRecords).set({
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
  }).where(eq(healthRecords.id, id)).returning();
  
  return updated[0];
});
