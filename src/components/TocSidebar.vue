<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  contentSelector: string  // 内容区域的选择器，如 '.prose'
  headingSelector?: string // 标题选择器，默认为 'h2'
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

const sidebarOpen = ref(true)
const headings = ref<Heading[]>([])
const activeHeading = ref('')

// 提取标题
function extractHeadings() {
  const contentEl = document.querySelector(props.contentSelector)
  if (!contentEl) {
    headings.value = []
    return
  }

  const selector = props.headingSelector || 'h2'
  const elements = contentEl.querySelectorAll(selector)

  headings.value = Array.from(elements).map((el, index) => {
    const id = `toc-heading-${index}`
    el.id = id
    return {
      id,
      text: el.textContent?.trim() || '',
      level: parseInt(el.tagName[1]) || 2
    }
  })
}

// 滚动到指定标题
function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    emit('navigate', id)
  }
}

// 更新当前高亮的标题
function updateActiveHeading() {
  const scrollY = window.scrollY + 120  // 偏移量，考虑固定导航
  const contentEl = document.querySelector(props.contentSelector)
  if (!contentEl) return

  const selector = props.headingSelector || 'h2'
  const elements = contentEl.querySelectorAll(selector)

  // 从后往前找，第一个在视口上方的就是当前项
  for (const el of Array.from(elements).reverse()) {
    if ((el as HTMLElement).offsetTop <= scrollY) {
      activeHeading.value = el.id
      return
    }
  }

  // 默认第一项
  activeHeading.value = elements[0]?.id || ''
}

// 刷新标题（供父组件调用）
function refresh() {
  setTimeout(extractHeadings, 50)
}

let scrollListener: (() => void) | null = null

onMounted(() => {
  extractHeadings()
  scrollListener = () => updateActiveHeading()
  window.addEventListener('scroll', scrollListener, { passive: true })
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
})

// 暴露方法给父组件
defineExpose({
  refresh,
  extractHeadings
})
</script>

<template>
  <div v-if="headings.length > 0" class="toc-sidebar">
    <div class="toc-sidebar-inner">
      <div class="toc-card">
        <!-- 头部：可点击展开/收起 -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="toc-header"
          :aria-expanded="sidebarOpen"
        >
          <span class="toc-header-content">
            <svg class="toc-icon-list" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>目录导航</span>
          </span>
          <svg
            :class="['toc-icon-arrow', { 'is-open': sidebarOpen }]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- 导航列表 -->
        <div v-show="sidebarOpen" class="toc-body">
          <nav class="toc-nav">
            <ul class="toc-list">
              <li
                v-for="heading in headings"
                :key="heading.id"
                class="toc-item"
                :class="`toc-level-${heading.level}`"
              >
                <button
                  @click="scrollToHeading(heading.id)"
                  :class="[
                    'toc-link',
                    { 'is-active': activeHeading === heading.id }
                  ]"
                  :title="heading.text"
                >
                  {{ heading.text.length > 24 ? heading.text.slice(0, 24) + '...' : heading.text }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toc-sidebar {
  width: 16rem;
  flex-shrink: 0;
}

@media (max-width: 1023px) {
  .toc-sidebar {
    display: none;
  }
}

.toc-sidebar-inner {
  position: sticky;
  top: 1.5rem;
}

.toc-card {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.toc-header {
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.toc-header:hover {
  background-color: #f9fafb;
}

.toc-header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toc-icon-list {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.toc-icon-arrow {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.toc-icon-arrow.is-open {
  transform: rotate(180deg);
}

.toc-body {
  border-top: 1px solid #f3f4f6;
}

.toc-nav {
  padding: 0.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.toc-nav::-webkit-scrollbar {
  width: 4px;
}

.toc-nav::-webkit-scrollbar-track {
  background: transparent;
}

.toc-nav::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 2px;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.toc-item {
  margin: 0;
}

/* 不同层级缩进 */
.toc-level-2 .toc-link {
  padding-left: 0.75rem;
}

.toc-level-3 .toc-link {
  padding-left: 1.25rem;
  font-size: 0.75rem;
}

.toc-level-4 .toc-link {
  padding-left: 1.75rem;
  font-size: 0.75rem;
}

.toc-link {
  width: 100%;
  text-align: left;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #4b5563;
  background-color: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.toc-link.is-active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

/* 折叠动画 */
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
