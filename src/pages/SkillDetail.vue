<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { skills } from '../data/skills'

const route = useRoute()
const router = useRouter()
const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
  },
})

const skill = computed(() => skills.find((s) => s.id === route.params.id))

const levelLabel: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
}

type Tab = 'knowledge' | 'interview'
const activeTab = ref<Tab>('knowledge')

const knowledgeHtml = ref('')
const interviewHtml = ref('')
const hasContent = ref(false)

async function loadContent(id: string) {
  knowledgeHtml.value = ''
  interviewHtml.value = ''
  hasContent.value = false
  try {
    const [k, i] = await Promise.all([
      import(`../skills/${id}/knowledge.md?raw`).catch(() => null),
      import(`../skills/${id}/interview.md?raw`).catch(() => null),
    ])
    if (k || i) {
      knowledgeHtml.value = k ? md.render(k.default) : ''
      interviewHtml.value = i ? md.render(i.default) : ''
      hasContent.value = true
    }
  } catch {
    // 该技能暂无内容
  }
}

watch(
  () => route.params.id as string,
  (id) => { if (id) loadContent(id) },
  { immediate: true }
)
</script>

<template>
  <div v-if="skill" class="max-w-5xl mx-auto px-6 py-10">
    <button
      @click="router.back()"
      class="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1 transition-colors"
    >
      ← 返回
    </button>

    <div class="flex items-center gap-4 mb-6">
      <span class="text-5xl">{{ skill.icon }}</span>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ skill.title }}</h1>
        <p class="text-gray-500 mt-1">{{ skill.description }}</p>
      </div>
    </div>

    <div class="flex gap-2 mb-8">
      <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {{ levelLabel[skill.level] }}
      </span>
      <span
        v-for="tag in skill.tags"
        :key="tag"
        class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Tab 切换 -->
    <div v-if="hasContent">
      <div class="flex gap-1 border-b border-gray-200 mb-6">
        <button
          v-for="tab in ([{ key: 'knowledge', label: '知识点' }, { key: 'interview', label: '面试题' }] as const)"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-8 prose" v-html="activeTab === 'knowledge' ? knowledgeHtml : interviewHtml" />
    </div>

    <div v-else class="bg-white rounded-xl border border-gray-200 p-8 text-gray-400 text-center">
      内容待填充...
    </div>
  </div>

  <div v-else class="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">
    技能不存在
  </div>
</template>

<style scoped>
.prose :deep(h1) { font-size: 1.6rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #111827; }
.prose :deep(h2) { font-size: 1.25rem; font-weight: 600; margin: 1.75rem 0 0.5rem; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
.prose :deep(h3) { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.4rem; color: #374151; }
.prose :deep(p) { margin: 0.6rem 0; line-height: 1.75; color: #374151; }
.prose :deep(ul), .prose :deep(ol) { padding-left: 1.5rem; margin: 0.5rem 0; color: #374151; }
.prose :deep(li) { margin: 0.25rem 0; line-height: 1.7; }
.prose :deep(code) { background: #f3f4f6; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.875em; color: #1d4ed8; font-family: ui-monospace, monospace; }
.prose :deep(pre) { margin: 1rem 0; border-radius: 8px; overflow-x: auto; }
.prose :deep(pre code) { background: transparent; color: inherit; padding: 0; font-size: 0.875rem; }
.prose :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
.prose :deep(th) { background: #f9fafb; padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; border: 1px solid #e5e7eb; color: #374151; }
.prose :deep(td) { padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; color: #4b5563; }
.prose :deep(tr:nth-child(even) td) { background: #f9fafb; }
.prose :deep(blockquote) { border-left: 3px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; color: #6b7280; font-style: italic; }
.prose :deep(hr) { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
.prose :deep(strong) { font-weight: 600; color: #111827; }
.prose :deep(a) { color: #2563eb; text-decoration: underline; }
</style>
