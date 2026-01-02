<script setup lang="ts">
import { Send, Mic, Square, Loader2 } from 'lucide-vue-next'

// Props & Emits
const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

// State
const text = ref('')

const { textarea, resize } = useAutoResize(text)

const {
  isSupported: isSpeechSupported,
  isListening,
  toggle: toggleSpeech,
  recognition
} = useSpeechRecognition()

// --- 🎤 Speech Logic ---
watch(recognition, (recInstance) => {
  if (isSpeechSupported.value && recInstance) {
    // Явно указываем тип event
    recInstance.onresult = (event: SpeechRecognitionEvent) => {
      const lastResultIndex = event.results.length - 1

      // 1. Безопасно получаем результат
      const result = event.results[lastResultIndex]

      // 2. GUARD CLAUSE: Если результата нет или нет вариантов текста — выходим
      // Это убирает ошибки 'possibly undefined'
      if (!result || !result[0]) return

      const transcript = result[0].transcript

      if (result.isFinal) {
        const prefix = text.value && !text.value.endsWith(' ') ? ' ' : ''
        text.value += prefix + transcript
        nextTick(resize)
      }
    }
  }
}, { immediate: true })

// Haptic Feedback Helper
const triggerHaptic = () => {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  }
}

// Handlers
const handleMicClick = () => {
  triggerHaptic()
  toggleSpeech()

  // Если остановили запись, возвращаем фокус в поле
  if (isListening.value) {
    // Началась запись
  } else {
    // Запись остановлена вручную
    nextTick(() => textarea.value?.focus())
  }
}

const handleSend = () => {
  if (!text.value.trim() || props.isLoading) return

  // Если шла запись — останавливаем
  if (isListening.value) {
    toggleSpeech()
  }

  emit('send', text.value)
  text.value = ''

  // Сбрасываем высоту и возвращаем фокус
  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.focus()
    }
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="p-3 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800 safe-pb">
    <div
      class="relative flex items-end gap-2 p-2 bg-gray-100 dark:bg-[#27272a] rounded-3xl transition-all border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-black/20"
      :class="{ 'ring-1 ring-red-500/30 bg-red-50/50 dark:bg-red-900/10': isListening }"
    >

      <!-- 🎤 Mic Button (Left) -->
      <button
        v-if="isSpeechSupported"
        @click="handleMicClick"
        class="mb-0.5 p-2 rounded-full transition-all duration-300 flex-shrink-0 flex items-center justify-center relative overflow-hidden group"
        :class="[
          isListening
            ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        ]"
      >
        <!-- Анимация волны при записи -->
        <span v-if="isListening" class="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></span>

        <Square v-if="isListening" class="w-5 h-5 fill-current relative z-10" />
        <Mic v-else class="w-5 h-5 relative z-10" />
      </button>

      <!-- 📝 Textarea -->
      <textarea
        ref="textarea"
        v-model="text"
        rows="1"
        :placeholder="isListening ? 'Слушаю...' : 'Ask anything...'"
        class="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 text-[16px] leading-relaxed py-2 focus:outline-none resize-none overflow-y-auto max-h-[140px]"
        @input="resize"
        @keydown="handleKeydown"
      ></textarea>

      <!-- 🚀 Send Button (Right) -->
      <button
        @click="handleSend"
        :disabled="(!text.trim() && !isListening) || isLoading"
        class="mb-0.5 p-2 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center"
        :class="[
          text.trim() && !isLoading
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
            : 'bg-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed'
        ]"
      >
        <Loader2 v-if="isLoading" class="w-6 h-6 animate-spin p-0.5" />
        <Send v-else class="w-6 h-6 ml-0.5" />
      </button>

    </div>
  </div>
</template>

<style scoped>
/* Убираем скроллбар */
textarea {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
textarea::-webkit-scrollbar {
  display: none;
}

/* Safe Area для iPhone без кнопки Home */
.safe-pb {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>
