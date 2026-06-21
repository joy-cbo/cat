<template>
  <div v-if="cat">
    <!-- 头部 -->
    <div class="flex items-center mb-6">
      <NuxtLink to="/cats" class="text-indigo-600 hover:text-indigo-800 mr-4">← 返回</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">{{ cat.name }}的档案</h1>
    </div>

    <!-- 基本信息 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-start">
        <div class="relative group">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img v-if="cat?.avatarUrl" :src="cat.avatarUrl" class="w-full h-full object-cover" />
            <span v-else class="text-4xl">🐱</span>
          </div>
          <label class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <span class="text-white text-sm">上传头像</span>
            <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
          </label>
        </div>
        <div class="flex-1">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span class="text-gray-500 text-sm">品种</span>
              <p class="font-medium">{{ cat.breed || '未知' }}</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">性别</span>
              <p class="font-medium">{{ cat.gender === 'male' ? '♂ 公' : '♀ 母' }}</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">年龄</span>
              <p class="font-medium">{{ calculateAge(cat.birthDate) }}</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">体重</span>
              <p class="font-medium">{{ cat.weight ? cat.weight + ' kg' : '未记录' }}</p>
            </div>
          </div>
          <div v-if="cat.notes" class="mt-4 p-3 bg-gray-50 rounded">
            <span class="text-gray-500 text-sm">备注</span>
            <p>{{ cat.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === tab.key ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 健康记录 -->
    <div v-if="activeTab === 'records'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">健康记录</h2>
        <button @click="showRecordModal = true" class="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
          + 添加记录
        </button>
      </div>
      <div v-if="records.length === 0" class="text-center py-8 text-gray-400">暂无记录</div>
      <div v-else class="space-y-4">
        <div v-for="record in records" :key="record.id" class="bg-white rounded-lg shadow p-4 border-l-4"
          :class="{
            'border-blue-500': record.type === 'vaccine',
            'border-green-500': record.type === 'deworming',
            'border-purple-500': record.type === 'visit',
            'border-yellow-500': record.type === 'sterilization',
          }"
        >
          <div class="flex justify-between">
            <div>
              <span class="inline-block px-2 py-1 text-xs rounded-full mr-2"
                :class="{
                  'bg-blue-100 text-blue-800': record.type === 'vaccine',
                  'bg-green-100 text-green-800': record.type === 'deworming',
                  'bg-purple-100 text-purple-800': record.type === 'visit',
                  'bg-yellow-100 text-yellow-800': record.type === 'sterilization',
                }"
              >{{ typeLabels[record.type] }}</span>
              <span class="font-medium">{{ record.vaccineName || record.medicineName || record.diagnosis || '-' }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-500 text-sm">{{ record.date }}</span>
              <button @click="deleteRecord(record.id)" class="text-red-500 hover:text-red-700 text-sm">删除</button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600 space-y-1">
            <p v-if="record.hospital">🏥 {{ record.hospital }}</p>
            <p v-if="record.cost">💰 ¥{{ record.cost }}</p>
            <p v-if="record.nextDate" class="text-orange-600">📅 下次: {{ record.nextDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 提醒 -->
    <div v-if="activeTab === 'reminders'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">提醒</h2>
        <button @click="showReminderModal = true" class="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
          + 添加提醒
        </button>
      </div>
      <div v-if="reminders.length === 0" class="text-center py-8 text-gray-400">暂无提醒</div>
      <div v-else class="space-y-3">
        <div v-for="reminder in reminders" :key="reminder.id"
          class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          :class="{ 'opacity-50': reminder.done }"
        >
          <div>
            <span class="text-2xl mr-2">{{ reminder.done ? '✅' : '⏰' }}</span>
            <span :class="{ 'line-through': reminder.done }">{{ typeLabels[reminder.type] }}: {{ reminder.remindAt }}</span>
            <p v-if="reminder.notes" class="text-gray-500 text-sm ml-8">{{ reminder.notes }}</p>
          </div>
          <button v-if="!reminder.done" @click="completeReminder(reminder.id)" class="text-green-600 hover:text-green-800">完成</button>
        </div>
      </div>
    </div>

    <!-- 添加记录弹窗 -->
    <div v-if="showRecordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">添加健康记录</h2>
        <form @submit.prevent="addRecord">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium">类型 *</label>
              <select v-model="recordForm.type" required class="mt-1 block w-full border rounded-md p-2">
                <option value="vaccine">疫苗</option>
                <option value="deworming">驱虫</option>
                <option value="sterilization">绝育</option>
                <option value="visit">就医</option>
                <option value="checkup">体检</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">日期 *</label>
              <input v-model="recordForm.date" type="date" required class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div v-if="recordForm.type === 'vaccine'">
              <label class="block text-sm font-medium">疫苗名称</label>
              <input v-model="recordForm.vaccineName" type="text" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div v-if="recordForm.type === 'deworming'">
              <label class="block text-sm font-medium">药品名称</label>
              <input v-model="recordForm.medicineName" type="text" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div v-if="recordForm.type === 'visit'">
              <label class="block text-sm font-medium">诊断结果</label>
              <input v-model="recordForm.diagnosis" type="text" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">医院</label>
              <input v-model="recordForm.hospital" type="text" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">费用</label>
              <input v-model="recordForm.cost" type="number" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">下次日期</label>
              <input v-model="recordForm.nextDate" type="date" class="mt-1 block w-full border rounded-md p-2" />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="showRecordModal = false" class="px-4 py-2 border rounded-md">取消</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">添加</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 添加提醒弹窗 -->
    <div v-if="showReminderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">添加提醒</h2>
        <form @submit.prevent="addReminder">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium">类型 *</label>
              <select v-model="reminderForm.type" required class="mt-1 block w-full border rounded-md p-2">
                <option value="vaccine">疫苗</option>
                <option value="deworming">驱虫</option>
                <option value="checkup">体检</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">提醒日期 *</label>
              <input v-model="reminderForm.remindAt" type="date" required class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">备注</label>
              <input v-model="reminderForm.notes" type="text" class="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div class="flex items-center">
              <input v-model="reminderForm.sendEmail" type="checkbox" id="sendEmail" class="rounded" />
              <label for="sendEmail" class="ml-2 text-sm text-gray-600">📧 创建时发送邮件通知</label>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="showReminderModal = false" class="px-4 py-2 border rounded-md">取消</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">添加</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const catId = route.params.id;

const showRecordModal = ref(false);
const showReminderModal = ref(false);
const activeTab = ref('records');

const tabs = [
  { key: 'records', label: '健康记录' },
  { key: 'reminders', label: '提醒' },
];

const typeLabels = { vaccine: '疫苗', deworming: '驱虫', sterilization: '绝育', visit: '就医', checkup: '体检', custom: '自定义' };

const recordForm = reactive({ type: 'vaccine', date: '', vaccineName: '', medicineName: '', diagnosis: '', hospital: '', cost: '', nextDate: '' });
const reminderForm = reactive({ type: 'vaccine', remindAt: '', notes: '', sendEmail: false });

const { data: allCats } = await useFetch('/api/cats');
const cat = computed(() => allCats.value?.find(c => c.id === Number(catId)));

const { data: records, refresh: refreshRecords } = await useFetch(`/api/cats/${catId}/records`);
const { data: reminders, refresh: refreshReminders } = await useFetch(`/api/reminders?catId=${catId}`);

const calculateAge = (birthDate) => {
  if (!birthDate) return '未知';
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  if (months < 12) return `${months}个月`;
  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  return remainMonths > 0 ? `${years}岁${remainMonths}个月` : `${years}岁`;
};

const addRecord = async () => {
  await $fetch(`/api/cats/${catId}/records`, { method: 'POST', body: recordForm });
  showRecordModal.value = false;
  Object.assign(recordForm, { type: 'vaccine', date: '', vaccineName: '', medicineName: '', diagnosis: '', hospital: '', cost: '', nextDate: '' });
  await refreshRecords();
};

const deleteRecord = async (id) => {
  if (confirm('确定删除这条记录？')) {
    await $fetch(`/api/records/${id}`, { method: 'DELETE' });
    await refreshRecords();
  }
};

const addReminder = async () => {
  await $fetch('/api/reminders', { method: 'POST', body: { ...reminderForm, catId: Number(catId) } });
  showReminderModal.value = false;
  Object.assign(reminderForm, { type: 'vaccine', remindAt: '', notes: '' });
  await refreshReminders();
};

const completeReminder = async (id) => {
  await $fetch(`/api/reminders/${id}/complete`, { method: 'PUT' });
  await refreshReminders();
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  const result = await $fetch('/api/upload', { method: 'POST', body: formData });
  
  // 更新猫咪头像
  await $fetch(`/api/cats/${catId}`, {
    method: 'PUT',
    body: { avatarUrl: result.url },
  });
  
  await refreshAll();
};

const refreshAll = async () => {
  await refreshRecords();
  await refreshReminders();
  // 刷新猫咪数据
  const updatedCats = await $fetch('/api/cats');
  // 触发重新渲染
  allCats.value = updatedCats;
};
</script>
