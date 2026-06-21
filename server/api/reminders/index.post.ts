import { reminders, cats, users } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { sendReminderEmail } from '~/server/utils/email';

export default defineEventHandler(async (event) => {
  const drizzle = await useDb(event);
  const body = await readBody(event);
  
  const newReminder = await drizzle.insert(reminders).values({
    catId: body.catId,
    type: body.type,
    remindAt: body.remindAt,
    notes: body.notes,
  }).returning();
  
  // 尝试发送邮件通知（如果配置了的话）
  try {
    const cat = await drizzle.select().from(cats).where(eq(cats.id, body.catId));
    const user = await drizzle.select().from(users).where(eq(users.id, cat[0]?.ownerId || 1));
    
    if (user[0]?.email) {
      await sendReminderEmail({
        to: user[0].email,
        catName: cat[0]?.name || '未知猫咪',
        type: body.type,
        remindDate: body.remindAt,
        notes: body.notes,
      });
    }
  } catch (error) {
    // 邮件发送失败不影响提醒创建
    console.error('[Reminder] Email notification failed:', error);
  }
  
  return newReminder[0];
});
