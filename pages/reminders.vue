<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">提醒通知</h1>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + 添加提醒
      </button>
    </div>

    <div v-if="pendingReminders.length === 0 && completedReminders.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">⏰</div>
      <p class="text-gray-500">暂无提醒</p>
    </div>

    <div v-else class="space-y-6">
      <!-- 待办提醒 -->
      <div v-if="pendingReminders.length > 0">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">待办提醒</h2>
        <div class="space-y-3">
          <div
            v-for="reminder in pendingReminders"
            :key="reminder.id"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ typeEmojis[reminder.type] }}</span>
              <div>
                <span class="inline-block px-2 py-1 text-xs rounded-full mr-2"
                  :class="{
                    'bg-blue-100 text-blue-800': reminder.type === 'vaccine',
                    'bg-green-100 text-green-800': reminder.type === 'deworming',
                    'bg-yellow-100 text-yellow-800': reminder.type === 'checkup',
                  }"
                >
                  {{ typeLabels[reminder.type] }}
                </span>
                <span class="text-gray-900">{{ reminder.notes || '待办事项' }}</span>
                <p class="text-gray-500 text-sm">⏰ {{ reminder.remindAt }}</p>
              </div>
            </div>
            <button
              @click="completeReminder(reminder.id)"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              完成
            </button>
          </div>
        </div>
      </div>

      <!-- 已完成 -->
      <div v-if="completedReminders.length > 0">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">已完成</h2>
        <div class="space-y-3">
          <div
            v-for="reminder in completedReminders"
            :key="reminder.id"
            class="bg-gray-50 rounded-lg p-4 opacity-60"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ typeEmojis[reminder.type] }}</span>
              <div>
                <span class="text-gray-500 line-through">{{ reminder.notes || '待办事项' }}</span>
                <p class="text-gray-400 text-sm">{{ reminder.remindAt }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加提醒弹窗 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">添加提醒</h2>
        <form @submit.prevent="addReminder">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">猫咪 *</label>
              <select v-model="form.catId" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option v-for="cat in cats" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">类型 *</label>
              <select v-model="form.type" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="vaccine">疫苗</option>
                <option value="deworming">驱虫</option>
                <option value="checkup">体检</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">提醒日期 *</label>
              <input v-model="form.remindAt" type="date" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">备注</label>
              <input v-model="form.notes" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div class="flex items-center">
              <input v-model="form.sendEmail" type="checkbox" id="sendEmailRemind" class="rounded" />
              <label for="sendEmailRemind" class="ml-2 text-sm text-gray-600">📧 发送邮件通知</label>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 border rounded-md">取消</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">添加</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const cats = ref([]);
const reminders = ref([]);
const showAddModal = ref(false);

const form = reactive({
  catId: '',
  type: 'vaccine',
  remindAt: '',
  notes: '',
  sendEmail: false,
});

const typeLabels = { vaccine: '疫苗', deworming: '驱虫', checkup: '体检', custom: '自定义' };
const typeEmojis = { vaccine: '💉', deworming: '💊', checkup: '🏥', custom: '📌' };

const pendingReminders = computed(() => reminders.value.filter(r => !r.done));
const completedReminders = computed(() => reminders.value.filter(r => r.done));

const fetchData = async () => {
  cats.value = await $fetch('/api/cats');
  reminders.value = await $fetch('/api/reminders');
};

const addReminder = async () => {
  await $fetch('/api/reminders', { method: 'POST', body: form });
  showAddModal.value = false;
  form.catId = '';
  form.type = 'vaccine';
  form.remindAt = '';
  form.notes = '';
  form.sendEmail = false;
  await fetchData();
};

const completeReminder = async (id) => {
  await $fetch(`/api/reminders/${id}/complete`, { method: 'PUT' });
  await fetchData();
};

onMounted(() => {
  fetchData();
});
</script>
