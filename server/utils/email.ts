import { Resend } from 'resend';

export function useEmail() {
  const config = useRuntimeConfig();
  const apiKey = config.resendApiKey || process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured');
    return null;
  }
  
  return new Resend(apiKey);
}

export async function sendReminderEmail(options: {
  to: string;
  catName: string;
  type: string;
  remindDate: string;
  notes?: string;
}) {
  const resend = useEmail();
  
  if (!resend) {
    console.log('[Email] Skipping - no API key configured');
    return { success: false, message: '邮件服务未配置' };
  }
  
  const typeLabels: Record<string, string> = {
    vaccine: '疫苗接种',
    deworming: '驱虫',
    checkup: '体检',
    custom: '提醒',
  };
  
  const typeEmojis: Record<string, string> = {
    vaccine: '💉',
    deworming: '💊',
    checkup: '🏥',
    custom: '📌',
  };
  
  const label = typeLabels[options.type] || options.type;
  const emoji = typeEmojis[options.type] || '📌';
  
  try {
    const { data, error } = await resend.emails.send({
      from: '猫咪管理系统 <onboarding@resend.dev>',
      to: options.to,
      subject: `${emoji} ${options.catName} - ${label}提醒`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .info-label { color: #666; }
            .info-value { font-weight: 600; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐱 猫咪管理系统</h1>
            </div>
            <div class="content">
              <h2>${emoji} ${label}提醒</h2>
              <p>亲爱的主人，您有一条待办事项：</p>
              
              <div class="info-box">
                <div class="info-row">
                  <span class="info-label">猫咪：</span>
                  <span class="info-value">${options.catName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">类型：</span>
                  <span class="info-value">${label}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">日期：</span>
                  <span class="info-value">${options.remindDate}</span>
                </div>
                ${options.notes ? `
                <div class="info-row">
                  <span class="info-label">备注：</span>
                  <span class="info-value">${options.notes}</span>
                </div>
                ` : ''}
              </div>
              
              <p>请及时处理，确保猫咪的健康！</p>
              
              <a href="#" class="button">查看详情</a>
            </div>
            <div class="footer">
              <p>此邮件由猫咪管理系统自动发送</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    if (error) {
      console.error('[Email] Send error:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('[Email] Error:', error);
    return { success: false, message: error.message };
  }
}
