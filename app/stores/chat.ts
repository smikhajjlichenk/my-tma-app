// Technical English: defining an Interface for type safety
export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: Date
}

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Hello! I am your AI assistant. How can I help you today?',
      createdAt: new Date()
    }
  ])

  const isLoading = ref(false)

  // Actions
  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      createdAt: new Date()
    }
    messages.value.push(userMsg)

    // 2. Simulate AI Delay (Mocking the API request)
    isLoading.value = true

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `You said: "${text}". This is a mock response from Nuxt! 🚀`,
        createdAt: new Date()
      }
      messages.value.push(aiMsg)
      isLoading.value = false
    }, 1500)
  }

  return {
    messages,
    isLoading,
    sendMessage
  }
})
