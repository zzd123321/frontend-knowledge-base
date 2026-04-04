<script setup lang="ts">
import { ref, computed } from 'vue'
import { skills } from '../data/skills'
import SkillCard from '../components/SkillCard.vue'
import type { SkillLevel } from '../types'

const selectedLevel = ref<SkillLevel | 'all'>('all')

const levels: { value: SkillLevel | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' },
]

const filtered = computed(() =>
  selectedLevel.value === 'all'
    ? skills
    : skills.filter((s) => s.level === selectedLevel.value)
)
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">前端技能图谱</h1>
    <p class="text-gray-500 mb-8">系统学习前端开发所需的核心技能</p>

    <div class="flex gap-2 mb-8">
      <button
        v-for="l in levels"
        :key="l.value"
        @click="selectedLevel = l.value"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          selectedLevel === l.value
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400',
        ]"
      >
        {{ l.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SkillCard v-for="skill in filtered" :key="skill.id" :skill="skill" />
    </div>
  </div>
</template>
