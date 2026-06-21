<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">我的猫咪</h1>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + 添加猫咪
      </button>
    </div>

    <div v-if="cats.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🐱</div>
      <p class="text-gray-500">还没有添加猫咪，点击上方按钮开始吧！</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cat in cats"
        :key="cat.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <img
            v-if="cat.avatarUrl"
            :src="cat.avatarUrl"
            :alt="cat.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-6xl">🐱</span>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-bold text-gray-900">{{ cat.name }}</h3>
          <p class="text-gray-600 mt-1">{{ cat.breed || '未知品种' }}</p>
          <div class="mt-3 flex justify-between items-center">
            <span class="text-sm text-gray-500">
              {{ cat.gender === 'male' ? '♂ 公' : '♀ 母' }}
            </span>
            <NuxtLink
              :to="`/cats/${cat.id}`"
              class="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              查看详情 →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加猫咪弹窗 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">添加新猫咪</h2>
        <form @submit.prevent="addCat">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">名字 *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">品种</label>
              <input
                v-model="form.breed"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">性别 *</label>
              <select
                v-model="form.gender"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="male">公</option>
                <option value="female">母</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">出生日期</label>
              <input
                v-model="form.birthDate"
                type="date"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const cats = ref([]);
const showAddModal = ref(false);
const form = reactive({
  name: '',
  breed: '',
  gender: 'male',
  birthDate: '',
});

const fetchCats = async () => {
  const data = await $fetch('/api/cats');
  cats.value = data;
};

const addCat = async () => {
  await $fetch('/api/cats', {
    method: 'POST',
    body: form,
  });
  showAddModal.value = false;
  form.name = '';
  form.breed = '';
  form.gender = 'male';
  form.birthDate = '';
  await fetchCats();
};

onMounted(() => {
  fetchCats();
});
</script>
