<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { storeToRefs } from 'pinia' // Убедись, что импортировано
import { useChatStore } from '~/stores/chat'

// Init Store
const chatStore = useChatStore()
const { messages, isLoading } = storeToRefs(chatStore)

// Refs
const messagesContainer = ref<HTMLElement | null>(null)

// Actions
// Теперь функция принимает text из события компонента ChatInput
const handleSend = async (text: string) => {
  await chatStore.sendMessage(text)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    // ScrollHeight - ClientHeight дает нам позицию самого низа
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watchers
// Следим за обновлением массива сообщений
watch(
  () => messages.value.length,
  () => scrollToBottom()
)

// Lifecycle
// Важно для Persistence: при F5 скроллим к последнему сообщению
onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <!-- Main Layout: Full viewport height, flex column -->
  <div class="flex flex-col h-screen bg-white dark:bg-black transition-colors duration-300">

    <!-- Header -->
    <header class="flex-none p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
      <NuxtLink
        to="/"
        class="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </NuxtLink>
      <div>
        <h1 class="font-bold text-gray-800 dark:text-white text-lg leading-tight">AI Assistant</h1>
        <div class="flex items-center gap-1.5">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs text-gray-500 font-medium">Online</span>
        </div>
      </div>
      <NuxtLink
        to="/settings"
        class="ml-auto text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Settings class="w-6 h-6" />
      </NuxtLink>
    </header>

    <!-- Messages Area -->
    <main
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 scroll-smooth"
    >
      <!-- Message List -->
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />

      <!-- Typing Indicator (плавное появление) -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="isLoading" class="flex items-center gap-2 text-gray-400 text-xs ml-4 mb-2">
          <div class="flex space-x-1">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span>Thinking...</span>
        </div>
      </transition>

      <!-- Пустой блок внизу, чтобы контент не прилипал к инпуту при скролле -->
      <div class="h-2"></div>
    </main>

    <!-- Input Area -->
    <!-- Мы убрали <footer>, так как компонент сам содержит wrapper -->
    <ChatInput
      class="flex-none z-20"
      :is-loading="isLoading"
      @send="handleSend"
    />

  </div>
</template>
