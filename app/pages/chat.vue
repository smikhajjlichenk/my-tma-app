<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

// Init Store
const chatStore = useChatStore()
const { messages, isLoading } = storeToRefs(chatStore)

// Local state for input
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Actions
const handleSend = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const text = userInput.value
  userInput.value = '' // Clear input immediately (Optimistic UI)

  await chatStore.sendMessage(text)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick() // Wait for DOM update
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watcher to scroll down when new messages arrive
watch(messages.value, () => {
  scrollToBottom()
})
</script>

<template>
  <!-- Main Layout: Full viewport height, flex column -->
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900">

    <!-- Header (Optional, simplified for now) -->
    <header class="p-4 border-b dark:border-gray-800 flex items-center gap-2">
      <NuxtLink to="/" class="text-gray-500">← Back</NuxtLink>
      <h1 class="font-bold text-gray-800 dark:text-white">AI Assistant</h1>
    </header>

    <!-- Messages Area (Flex-grow takes available space) -->
    <main
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 scroll-smooth"
    >
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-gray-400 text-xs ml-2 animate-pulse">
        AI is typing...
      </div>
    </main>

    <!-- Input Area (Sticky Bottom) -->
    <footer class="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
      <form @submit.prevent="handleSend" class="flex gap-2">
        <input
          v-model="userInput"
          type="text"
          placeholder="Ask something..."
          class="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          :disabled="!userInput.trim() || isLoading"
          class="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <!-- Icon Send -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </footer>
  </div>
</template>
