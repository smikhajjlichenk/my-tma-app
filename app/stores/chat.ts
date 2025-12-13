export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: Date
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am your AI assistant. I am now connected to the real brain. Ask me anything!',
      createdAt: new Date()
    }
  ])

  const isLoading = ref(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    // 1. Добавляем сообщение юзера сразу (Optimistic UI)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      createdAt: new Date()
    }
    messages.value.push(userMsg)
    isLoading.value = true

    try {
      // 2. Формируем историю для отправки (API ждет массив {role, content})
      // Берем последние 10 сообщений для контекста, чтобы экономить токены
      const apiMessages = messages.value.slice(-10).map(m => ({
        role: m.role,
        content: m.text
      }))

      // 3. Делаем запрос на НАШ сервер (Server Route)
      const data = await $fetch<{ message: { content: string } }>('/api/chat', {
        method: 'POST',
        body: { messages: apiMessages }
      })

      // 4. Добавляем ответ AI
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
      // Можно добавить системное сообщение об ошибке в чат
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

  return {
    messages,
    isLoading,
    sendMessage
  }
})
