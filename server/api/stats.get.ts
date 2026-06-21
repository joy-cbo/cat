import { healthRecords, cats } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const drizzle = useDb(event);
  
  // 获取所有猫咪
  const allCats = await drizzle.select().from(cats);
  
  // 获取所有体重记录
  const weightRecords = await drizzle.select().from(healthRecords).where(eq(healthRecords.type, 'weight'));
  
  // 获取所有医疗费用记录
  const costRecords = await drizzle.select().from(healthRecords);
  
  // 计算每只猫的体重曲线
  const weightData = allCats.map(cat => ({
    catId: cat.id,
    catName: cat.name,
    records: weightRecords
      .filter(r => r.catId === cat.id)
      .map(r => ({ date: r.date, weight: r.notes ? parseFloat(r.notes) : 0 }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  }));
  
  // 计算总费用
  const totalCost = costRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
  
  // 按类型统计费用
  const costByType = costRecords.reduce((acc, r) => {
    if (r.cost) {
      acc[r.type] = (acc[r.type] || 0) + r.cost;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // 按月份统计费用
  const costByMonth = costRecords.reduce((acc, r) => {
    if (r.cost && r.date) {
      const month = r.date.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + r.cost;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCats: allCats.length,
    totalRecords: costRecords.length,
    totalCost,
    costByType,
    costByMonth,
    weightData,
  };
});
