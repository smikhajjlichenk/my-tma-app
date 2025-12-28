export const useSettingsStore = defineStore('settings', () => {
  // --- STATE ---

  // Роль бота. По умолчанию - просто помощник.
  const systemPrompt = ref('You are a helpful AI assistant.')

  // Модель (Groq поддерживает Llama 3)
  // Варианты: 'llama3-8b-8192' (быстрая), 'llama3-70b-8192' (умная)
  const selectedModel = ref('llama-3.3-70b-versatile')

  // Креативность (0.0 - строгий робот, 1.0 - фантазер)
  const temperature = ref(0.7)

  // --- ACTIONS ---

  const resetSettings = () => {
    systemPrompt.value = 'You are a helpful AI assistant.'
    selectedModel.value = 'llama-3.3-70b-versatile'
    temperature.value = 0.7
  }

  return {
    systemPrompt,
    selectedModel,
    temperature,
    resetSettings
  }
}, {
  // --- PERSISTENCE ---
  persist: {
    pick: ['systemPrompt', 'selectedModel', 'temperature'], // Сохраняем всё
  }
})
