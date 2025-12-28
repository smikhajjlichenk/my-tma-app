import { useSettingsStore } from './settings' // <--- IMPORT
export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: Date
}

export const useChatStore = defineStore('chat', () => {
  // --- STATE ---
  const messages = ref<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am your AI assistant. I am now connected to the real brain. Ask me anything!',
      createdAt: new Date()
    }
  ])

  const isLoading = ref(false)
  const settingsStore = useSettingsStore()

  // --- ACTIONS ---
  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      createdAt: new Date()
    }
    messages.value.push(userMsg)
    isLoading.value = true

    try {
      const apiMessages = messages.value.slice(-10).map(m => ({
        role: m.role,
        content: m.text
      }))

      const payload = {
        messages: apiMessages,
        // Добавляем настройки в запрос
        model: settingsStore.selectedModel,
        temperature: settingsStore.temperature,
        systemPrompt: settingsStore.systemPrompt
      }

      const data = await $fetch<{ message: { content: string } }>('/api/chat', {
        method: 'POST',
        body: payload
      })

      if (data.message && data.message.content) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.message.content,
          createdAt: new Date()
        }
        messages.value.push(aiMsg)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      messages.value.push({
        id: Date.now().toString(),
        role: 'assistant',
        text: 'Sorry, I realized I have connection issues. Please try again later.',
        createdAt: new Date()
      })
    } finally {
      isLoading.value = false
    }
  }

  const clearHistory = () => {
    messages.value = []
  }

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory
  }
}, {
  // --- PERSISTENCE CONFIGURATION ---
  persist: {
    pick: ['messages'],

    // Serializer обязателен для восстановления дат
    serializer: {
      serialize: (state) => JSON.stringify(state),
      deserialize: (storageValue) => {
        try {
          const parsed = JSON.parse(storageValue)
          if (parsed.messages) {
            parsed.messages = parsed.messages.map((m: any) => ({
              ...m,
              createdAt: new Date(m.createdAt)
            }))
          }
          return parsed
        } catch (e) {
          console.error('Persistence deserialization error:', e)
          return { messages: [] }
        }
      }
    }
  }
})
