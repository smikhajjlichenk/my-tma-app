<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { useChatStore } from '~/stores/chat'

const settingsStore = useSettingsStore()
const chatStore = useChatStore()
const router = useRouter()

// Очистка чата
const handleClearHistory = () => {
  if (confirm('Are you sure you want to delete all messages?')) {
    chatStore.clearHistory()
  }
}

const goBack = () => {
  // Проверяем, есть ли история, чтобы вернуться. Если нет — кидаем на главную.
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col">

    <!-- Header -->
    <header class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center bg-white dark:bg-black sticky top-0 z-10">
      <button @click="goBack" class="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
      <h1 class="text-xl font-bold">Settings</h1>
    </header>

    <main class="flex-1 p-6 max-w-2xl mx-auto w-full space-y-8">

      <!-- 1. AI Persona (System Prompt) -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Persona</h2>
        <div class="bg-white dark:bg-[#18181b] rounded-2xl p-1 border border-gray-200 dark:border-gray-800 shadow-sm">
          <textarea
            v-model="settingsStore.systemPrompt"
            rows="4"
            class="w-full bg-transparent p-4 outline-none resize-none text-sm leading-relaxed"
            placeholder="e.g. You are a strict English teacher. Correct my mistakes."
          ></textarea>
        </div>
        <p class="text-xs text-gray-400 mt-2 ml-1">
          Define how the AI should behave.
        </p>
      </section>

      <!-- 2. Model Selection -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Model</h2>
        <div class="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <select
            v-model="settingsStore.selectedModel"
            class="w-full bg-transparent p-4 outline-none appearance-none cursor-pointer text-sm text-gray-900 dark:text-gray-100"
          >
            <!-- Самая умная (Default) -->
            <option value="llama-3.3-70b-versatile">Llama 3.3 (70b) - Smartest</option>

            <!-- Самая быстрая -->
            <option value="llama-3.1-8b-instant">Llama 3.1 (8b) - Fastest</option>
          </select>
        </div>
        <p class="text-xs text-gray-400 mt-2 ml-1">
          Llama 3.3 is recommended for complex tasks.
        </p>
      </section>

      <!-- 3. Temperature (Creativity) -->
      <section>
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Creativity</h2>
          <span class="text-xs font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{{ settingsStore.temperature }}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model.number="settingsStore.temperature"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        >
        <div class="flex justify-between text-[10px] text-gray-400 mt-2">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </section>

      <!-- 4. Danger Zone -->
      <section class="pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          @click="handleClearHistory"
          class="w-full py-3 text-red-500 font-medium bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Clear Chat History
        </button>
      </section>

    </main>
  </div>
</template>
