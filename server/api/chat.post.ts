import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Проверка ключа (Safety First)
  if (!config.groqApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Groq API Key is missing' })
  }

  // 1. Инициализация клиента
  const openai = new OpenAI({
    apiKey: config.groqApiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  // 2. Читаем настройки из тела запроса (с дефолтными значениями)
  const body = await readBody(event)

  // Деструктуризация: Если фронтенд не прислал настройку, берем дефолт
  const {
    messages,
    model = 'llama-3.3-70b-versatile', // Твоя любимая модель по умолчанию
    systemPrompt = 'You are a helpful assistant in a Telegram Mini App. Be concise.',
    temperature = 0.7
  } = body

  if (!messages) throw createError({ statusCode: 400, statusMessage: 'No messages' })

  try {
    // 3. Формируем историю: System Prompt всегда первый
    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // 4. Делаем запрос с динамическими параметрами
    const completion = await openai.chat.completions.create({
      model: model,           // <-- Подставляем выбранную юзером модель
      messages: conversation, // <-- История с правильным System Prompt
      temperature: Number(temperature), // <-- Подставляем температуру
      max_tokens: 1024,       // Чуть увеличил лимит для развернутых ответов
      top_p: 1,
      stream: false,
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
