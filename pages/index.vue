<template>
  <div>
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">欢迎使用猫咪管理系统</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg p-6">
          <div class="text-center">
            <div class="text-4xl mb-4">🐱</div>
            <h3 class="text-lg font-medium text-gray-900">猫咪档案</h3>
            <p class="mt-2 text-gray-600">管理你的猫咪信息</p>
            <NuxtLink to="/cats" class="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              开始管理
            </NuxtLink>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg p-6">
          <div class="text-center">
            <div class="text-4xl mb-4">💉</div>
            <h3 class="text-lg font-medium text-gray-900">健康记录</h3>
            <p class="mt-2 text-gray-600">疫苗、驱虫、就医记录</p>
            <NuxtLink to="/records" class="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              查看记录
            </NuxtLink>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg p-6">
          <div class="text-center">
            <div class="text-4xl mb-4">⏰</div>
            <h3 class="text-lg font-medium text-gray-900">提醒通知</h3>
            <p class="mt-2 text-gray-600">疫苗、驱虫到期提醒</p>
            <NuxtLink to="/reminders" class="mt-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              查看提醒
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
