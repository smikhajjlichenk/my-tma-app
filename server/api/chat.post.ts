import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.groqApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Groq API Key is missing' })
  }

  // 1. Инициализация: Добавляем baseURL для Groq
  const openai = new OpenAI({
    apiKey: config.groqApiKey,
    baseURL: 'https://api.groq.com/openai/v1', // <--- ВАЖНО: Перенаправляем запросы
  })

  const body = await readBody(event)
  const { messages } = body

  if (!messages) throw createError({ statusCode: 400, statusMessage: 'No messages' })

  try {
    // 2. Запрос: Меняем модель на Llama 3 (бесплатная и мощная)
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // <--- Одна из лучших открытых моделей сейчас
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in a Telegram Mini App. Be concise.'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      message: completion.choices[0].message
    }

  } catch (error: any) {
    console.error('Groq Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'AI Service Error'
    })
  }
})
