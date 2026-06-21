<template>
  <div class="min-h-screen">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              🐱 猫咪管理系统
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/cats" class="text-gray-600 hover:text-gray-900">
              猫咪管理
            </NuxtLink>
            <NuxtLink to="/records" class="text-gray-600 hover:text-gray-900">
              健康记录
            </NuxtLink>
            <NuxtLink to="/reminders" class="text-gray-600 hover:text-gray-900">
              提醒
            </NuxtLink>
            <NuxtLink to="/stats" class="text-gray-600 hover:text-gray-900">
              统计
            </NuxtLink>
            <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900">
              登录
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
