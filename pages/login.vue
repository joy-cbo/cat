<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <div class="text-6xl mb-4">🐱</div>
        <h2 class="text-3xl font-bold text-gray-900">猫咪管理系统</h2>
        <p class="mt-2 text-gray-600">登录你的账号</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">邮箱</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">密码</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            登录
          </button>
        </div>
        <div class="text-center">
          <NuxtLink to="/register" class="text-indigo-600 hover:text-indigo-800">
            还没有账号？立即注册
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const router = useRouter()
const form = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    })
    alert('登录成功！')
    router.push('/')
  } catch (error) {
    alert(error.data?.message || '登录失败')
  }
}
</script>
