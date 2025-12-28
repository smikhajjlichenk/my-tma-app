<script setup lang="ts">
import type { Message } from '~/stores/chat'

// Tech English: "Props definition"
interface Props {
  message: Message
}

const props = defineProps<Props>()

// 1. Hook into our Markdown engine
const { render } = useMarkdown()

// 2. Computed property to determine alignment
const isUser = computed(() => props.message.role === 'user')

// 3. Memoize Markdown rendering (Performance optimization)
// Рендерим только если это ответ AI, иначе возвращаем пустую строку (экономим ресурсы)
const renderedContent = computed(() => {
  if (isUser.value) return ''
  return render(props.message.text)
})
</script>

<template>
  <div
    class="flex w-full mb-4"
    :class="isUser ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden"
      :class="[
        isUser
          ? 'bg-blue-600 text-white rounded-br-none' // User style
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700' // AI style
      ]"
    >
      <!-- Option A: User Message (Plain Text) -->
      <!-- whitespace-pre-wrap сохраняет форматирование отступов и переносов пользователя -->
      <div
        v-if="isUser"
        class="whitespace-pre-wrap break-words"
      >
        {{ message.text }}
      </div>

      <!-- Option B: AI Message (Markdown Rendered) -->
      <!-- class="markdown-body" подтягивает наши стили из SCSS -->
      <div
        v-else
        class="markdown-body break-words"
        v-html="renderedContent"
      ></div>

      <!-- Timestamp -->
      <div
        class="text-[10px] mt-1 text-right select-none"
        :class="isUser ? 'text-blue-100 opacity-80' : 'text-gray-400 opacity-70'"
      >
        {{ message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </div>
    </div>
  </div>
</template>
