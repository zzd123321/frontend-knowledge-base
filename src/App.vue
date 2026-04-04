<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <RouterLink to="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
        前端知识库
      </RouterLink>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
