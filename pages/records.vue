<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">健康记录</h1>
      <NuxtLink to="/cats" class="text-indigo-600 hover:text-indigo-800">
        ← 返回猫咪列表
      </NuxtLink>
    </div>

    <div v-if="cats.length === 0" class="text-center py-12">
      <p class="text-gray-500">还没有猫咪，先去添加猫咪吧</p>
    </div>

    <div v-else class="space-y-6">
      <div v-for="cat in cats" :key="cat.id" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <span class="text-3xl mr-3">🐱</span>
          <div>
            <h2 class="text-xl font-bold">{{ cat.name }}</h2>
            <p class="text-gray-500 text-sm">{{ cat.breed || '未知品种' }}</p>
          </div>
        </div>

        <div v-if="catRecords[cat.id]?.length" class="space-y-3">
          <div
            v-for="record in catRecords[cat.id]"
            :key="record.id"
            class="border-l-4 border-indigo-500 pl-4 py-2"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="inline-block px-2 py-1 text-xs rounded-full mr-2"
                  :class="{
                    'bg-blue-100 text-blue-800': record.type === 'vaccine',
                    'bg-green-100 text-green-800': record.type === 'deworming',
                    'bg-purple-100 text-purple-800': record.type === 'visit',
                    'bg-yellow-100 text-yellow-800': record.type === 'sterilization',
                    'bg-gray-100 text-gray-800': record.type === 'checkup',
                  }"
                >
                  {{ typeLabels[record.type] }}
                </span>
                <span class="text-gray-900 font-medium">{{ record.vaccineName || record.medicineName || record.diagnosis || record.type }}</span>
              </div>
              <span class="text-gray-500 text-sm">{{ record.date }}</span>
            </div>
            <p v-if="record.hospital" class="text-gray-600 text-sm mt-1">🏥 {{ record.hospital }}</p>
            <p v-if="record.cost" class="text-gray-600 text-sm">💰 ¥{{ record.cost }}</p>
            <p v-if="record.nextDate" class="text-orange-600 text-sm">📅 下次: {{ record.nextDate }}</p>
          </div>
        </div>
        <div v-else class="text-gray-400 text-center py-4">暂无记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cats = ref([]);
const catRecords = ref({});

const typeLabels = {
  vaccine: '疫苗',
  deworming: '驱虫',
  sterilization: '绝育',
  visit: '就医',
  checkup: '体检',
  weight: '体重',
  care: '护理',
};

const fetchData = async () => {
  cats.value = await $fetch('/api/cats');
  for (const cat of cats.value) {
    catRecords.value[cat.id] = await $fetch(`/api/cats/${cat.id}/records`);
  }
};

onMounted(() => {
  fetchData();
});
</script>
