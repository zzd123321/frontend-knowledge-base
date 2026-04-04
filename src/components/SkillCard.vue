<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Skill } from '../types'

defineProps<{ skill: Skill }>()

const levelLabel: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
}

const levelColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}
</script>

<template>
  <RouterLink
    :to="`/skill/${skill.id}`"
    class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all block"
  >
    <div class="flex items-start justify-between mb-3">
      <span class="text-3xl">{{ skill.icon }}</span>
      <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', levelColor[skill.level]]">
        {{ levelLabel[skill.level] }}
      </span>
    </div>
    <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ skill.title }}</h2>
    <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ skill.description }}</p>
    <div class="flex flex-wrap gap-1">
      <span
        v-for="tag in skill.tags"
        :key="tag"
        class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500"
      >
        {{ tag }}
      </span>
    </div>
  </RouterLink>
</template>
