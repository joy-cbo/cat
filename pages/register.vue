<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <div class="text-6xl mb-4">🐱</div>
        <h2 class="text-3xl font-bold text-gray-900">猫咪管理系统</h2>
        <p class="mt-2 text-gray-600">创建新账号</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
            <div v-if="form.password" class="mt-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded"
                  :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'"
                ></div>
              </div>
              <p class="text-xs mt-1" :class="passwordStrength.textColor">{{ passwordStrength.text }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">确认密码</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span v-if="showConfirmPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-xs text-red-500 mt-1">
              两次密码不一致
            </p>
            <p v-else-if="form.confirmPassword && form.password === form.confirmPassword" class="text-xs text-green-500 mt-1">
              ✓ 密码一致
            </p>
          </div>
        </div>
        <div>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="w-full py-3 rounded-md text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            :class="canSubmit ? 'bg-indigo-600 hover:bg-indigo-700' : ''"
          >
            注册
          </button>
        </div>
        <div class="text-center">
          <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-800">
            已有账号？立即登录
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
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return { level: 0, text: '', color: '', textColor: '' }
  
  let level = 0
  if (pwd.length >= 6) level++
  if (pwd.length >= 8) level++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) level++
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) level++
  
  const levels = [
    { text: '', color: 'bg-gray-200', textColor: '' },
    { text: '弱', color: 'bg-red-500', textColor: 'text-red-500' },
    { text: '一般', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { text: '较强', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { text: '强', color: 'bg-green-500', textColor: 'text-green-500' },
  ]
  
  return { level, ...levels[level] }
})

const canSubmit = computed(() => {
  return form.name && form.email && form.password && form.confirmPassword && form.password === form.confirmPassword
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
    })
    alert('注册成功！')
    router.push('/')
  } catch (error) {
    alert(error.data?.message || '注册失败')
  }
}
</script>
