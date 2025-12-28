<script setup lang="ts">
// Props & Emits
const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

// State
const text = ref('')

// Use our composable (Nuxt сам его найдет в папке composables)
const { textarea, resize } = useAutoResize(text)

// Handlers
const handleSend = () => {
  if (!text.value.trim() || props.isLoading) return

  emit('send', text.value)
  text.value = '' // Watcher в composable сам сбросит высоту

  // Фокус обратно на поле (UX improvement)
  nextTick(() => {
    textarea.value?.focus()
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  // Desktop UX: Enter = Send, Shift+Enter = New Line
  // Mobile UX: Usually Enter makes a new line, but for AI assistants "Enter to send" is standard too.
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="p-3 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800">
    <div class="relative flex items-end gap-2 p-2 bg-gray-100 dark:bg-[#27272a] rounded-3xl transition-colors border border-transparent focus-within:border-blue-500/50">

      <!-- Auto-resizing Textarea -->
      <textarea
        ref="textarea"
        v-model="text"
        rows="1"
        placeholder="Ask anything..."
        class="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 text-[15px] leading-relaxed px-3 py-2 focus:outline-none resize-none overflow-y-auto max-h-[140px]"
        @input="resize"
        @keydown="handleKeydown"
      ></textarea>

      <!-- Send Button -->
      <button
        @click="handleSend"
        :disabled="!text.trim() || isLoading"
        class="mb-0.5 p-2 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center"
        :class="[
          text.trim() && !isLoading
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
            : 'bg-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed'
        ]"
      >
        <!-- Icon: Paper Airplane (Telegram style) -->
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
        </svg>

        <!-- Loading Spinner (Optional UX Polish) -->
        <svg v-else class="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
textarea {
  /* Убираем стандартный скроллбар, чтобы было чище */
  scrollbar-width: none; /* Firefox */
}
textarea::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
