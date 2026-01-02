import { useSettingsStore } from './settings'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: Date
}

// 👇 Вспомогательный тип: так сообщение выглядит внутри localStorage (JSON)
type SerializedMessage = Omit<Message, 'createdAt'> & { createdAt: string }

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
      // Формируем историю для API
      const apiMessages = messages.value.slice(-10).map(m => ({
        role: m.role,
        content: m.text
      }))

      const payload = {
        messages: apiMessages,
        model: settingsStore.selectedModel,
        temperature: settingsStore.temperature,
        systemPrompt: settingsStore.systemPrompt
      }

      const data = await $fetch<{ message: { content: string } }>('/api/chat', {
        method: 'POST',
        body: payload
      })

      if (data.message?.content) {
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
  // --- PERSISTENCE ---
  persist: {
    pick: ['messages'],
    serializer: {
      serialize: (state) => JSON.stringify(state),
      deserialize: (storageValue) => {
        try {
          // 1. Парсим как "Сырой стейт" (где даты — это строки)
          const rawState = JSON.parse(storageValue) as { messages: SerializedMessage[] }

          // 2. Преобразуем в "Реальный стейт" (где даты — это Date)
          const realMessages: Message[] = rawState.messages
            ? rawState.messages.map((m) => ({
                ...m,
                createdAt: new Date(m.createdAt)
              }))
            : []

          // 3. Возвращаем объект, соответствующий Store State
          return {
            messages: realMessages
          }
        } catch (e) {
          console.error('Persistence deserialization error:', e)
          return { messages: [] }
        }
      }
    }
  }
})
