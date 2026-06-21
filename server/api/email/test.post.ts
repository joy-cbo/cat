import { sendReminderEmail } from '~/server/utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!body.to || !body.catName || !body.type || !body.remindDate) {
    throw createError({
      statusCode: 400,
      message: '请填写所有必填字段',
    });
  }
  
  const result = await sendReminderEmail({
    to: body.to,
    catName: body.catName,
    type: body.type,
    remindDate: body.remindDate,
    notes: body.notes,
  });
  
  return result;
});
