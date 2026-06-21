<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">数据统计</h1>

    <!-- 概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl mb-2">🐱</div>
        <div class="text-2xl font-bold">{{ stats?.totalCats || 0 }}</div>
        <div class="text-gray-500">猫咪数量</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl mb-2">📋</div>
        <div class="text-2xl font-bold">{{ stats?.totalRecords || 0 }}</div>
        <div class="text-gray-500">健康记录</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl mb-2">💰</div>
        <div class="text-2xl font-bold">¥{{ stats?.totalCost || 0 }}</div>
        <div class="text-gray-500">总花费</div>
      </div>
    </div>

    <!-- 费用分布 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">费用分布</h2>
      <div v-if="!stats?.costByType || Object.keys(stats.costByType).length === 0" class="text-center py-8 text-gray-400">暂无数据</div>
      <div v-else class="space-y-3">
        <div v-for="(cost, type) in stats.costByType" :key="type" class="flex items-center">
          <span class="w-20 text-sm text-gray-600">{{ typeLabels[type] || type }}</span>
          <div class="flex-1 mx-4">
            <div class="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full" :style="{ width: (cost / maxCost * 100) + '%' }"></div>
            </div>
          </div>
          <span class="text-sm font-medium">¥{{ cost }}</span>
        </div>
      </div>
    </div>

    <!-- 月度费用 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">月度费用</h2>
      <div v-if="!stats?.costByMonth || Object.keys(stats.costByMonth).length === 0" class="text-center py-8 text-gray-400">暂无数据</div>
      <div v-else class="space-y-3">
        <div v-for="(cost, month) in sortedMonths" :key="month" class="flex items-center">
          <span class="w-24 text-sm text-gray-600">{{ month }}</span>
          <div class="flex-1 mx-4">
            <div class="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full" :style="{ width: (cost / maxMonthCost * 100) + '%' }"></div>
            </div>
          </div>
          <span class="text-sm font-medium">¥{{ cost }}</span>
        </div>
      </div>
    </div>

    <!-- 体重趋势 -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">体重趋势</h2>
      <div v-if="!stats?.weightData || stats.weightData.length === 0" class="text-center py-8 text-gray-400">暂无体重记录</div>
      <div v-else class="space-y-6">
        <div v-for="catData in stats.weightData" :key="catData.catId">
          <h3 class="font-medium mb-2">{{ catData.catName }}</h3>
          <div v-if="catData.records.length === 0" class="text-gray-400 text-sm">暂无记录</div>
          <div v-else class="flex items-end space-x-2 h-32">
            <div v-for="record in catData.records" :key="record.date" class="flex-1 flex flex-col items-center">
              <div class="text-xs text-gray-500 mb-1">{{ record.weight }}kg</div>
              <div class="w-full bg-indigo-400 rounded-t" :style="{ height: (record.weight / maxWeight * 100) + '%' }"></div>
              <div class="text-xs text-gray-400 mt-1">{{ record.date.substring(5) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: stats } = await useFetch('/api/stats');

const typeLabels = {
  vaccine: '疫苗',
  deworming: '驱虫',
  sterilization: '绝育',
  visit: '就医',
  checkup: '体检',
  weight: '体重',
  care: '护理',
};

const maxCost = computed(() => {
  if (!stats.value?.costByType) return 1;
  return Math.max(...Object.values(stats.value.costByType), 1);
});

const maxMonthCost = computed(() => {
  if (!stats.value?.costByMonth) return 1;
  return Math.max(...Object.values(stats.value.costByMonth), 1);
});

const sortedMonths = computed(() => {
  if (!stats.value?.costByMonth) return {};
  return Object.fromEntries(
    Object.entries(stats.value.costByMonth).sort(([a], [b]) => b.localeCompare(a))
  );
});

const maxWeight = computed(() => {
  if (!stats.value?.weightData) return 10;
  let max = 5;
  for (const cat of stats.value.weightData) {
    for (const record of cat.records) {
      if (record.weight > max) max = record.weight;
    }
  }
  return max || 10;
});
</script>
