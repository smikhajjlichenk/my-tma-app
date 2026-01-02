import OpenAI from 'openai'

// 1. Описываем интерфейс входящего Body
interface ChatRequestBody {
  // Используем типы OpenAI для сообщений, чтобы быть уверенными в структуре
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
  model?: string
  systemPrompt?: string
  temperature?: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Проверка ключа
  if (!config.groqApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Groq API Key is missing' })
  }

  const openai = new OpenAI({
    apiKey: config.groqApiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  // 2. Типизируем readBody дженериком <ChatRequestBody>
  const body = await readBody<ChatRequestBody>(event)

  // Деструктуризация с дефолтными значениями
  // (TS теперь знает, что model - это string | undefined, поэтому дефолт работает корректно)
  const {
    messages,
    model = 'llama-3.3-70b-versatile',
    systemPrompt = 'You are a helpful assistant in a Telegram Mini App. Be concise.',
    temperature = 0.7
  } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, statusMessage: 'Messages are required and must be an array' })
  }

  try {
    // 3. Формируем историю.
    // Явно указываем тип массива, чтобы TS проверил структуру System Message
    const conversation: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const completion = await openai.chat.completions.create({
      model,
      messages: conversation,
      temperature: Number(temperature),
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    })

    return {
      message: completion.choices[0].message
    }

  } catch (error: unknown) { // 4. Используем unknown вместо any
    console.error('Groq Error:', error)

    // Безопасное извлечение сообщения об ошибке
    let errorMessage = 'AI Service Error'

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      // Для специфичных объектов ошибок, которые не наследуют Error (редко, но бывает)
      errorMessage = String((error as { message: unknown }).message)
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage
    })
  }
})
