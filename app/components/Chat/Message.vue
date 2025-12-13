<script setup lang="ts">
import type { Message } from '~/stores/chat'

// Tech English: "Props definition"
interface Props {
  message: Message
}

const props = defineProps<Props>()

// Computed property to determine alignment and color
const isUser = computed(() => props.message.role === 'user')
</script>

<template>
  <div
    class="flex w-full mb-4"
    :class="isUser ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm"
      :class="[
        isUser
          ? 'bg-blue-600 text-white rounded-br-none' // User style
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none' // AI style
      ]"
    >
      {{ message.text }}
      <div class="text-[10px] opacity-70 mt-1 text-right">
        {{ message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </div>
    </div>
  </div>
</template>
