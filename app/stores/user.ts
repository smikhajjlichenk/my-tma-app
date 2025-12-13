import { defineStore } from 'pinia'

interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  is_premium?: boolean
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | undefined>(undefined)
  const isReady = ref(false)

  // Getters
  const userInitials = computed(() => (user.value?.first_name?.[0] || '?').toUpperCase())
  const fullName = computed(() => {
    if (!user.value) return 'Guest'
    return `${user.value.first_name} ${user.value.last_name || ''}`.trim()
  })

  // Actions
  const initUser = () => {
    if (isReady.value) return

    console.log('🕵️‍♂️ User Store: Regex Hunter Mode')

    // 1. Собираем все места, где может быть хеш
    const hash = window.location.hash
    const backup = sessionStorage.getItem('tma_init_data_backup')

    // Берем самую длинную строку (обычно это полные данные)
    const rawData = (hash.length > (backup?.length || 0)) ? hash : (backup || '')

    if (!rawData) {
      console.log('❌ No data found anywhere')
      // Dev Mock
      if (import.meta.dev) {
         user.value = { id: 777, first_name: 'Dev', last_name: 'Test', is_premium: true }
      }
      isReady.value = true
      return
    }

    console.log('📜 Raw Data to scan:', rawData.substring(0, 50) + '...')

    try {
      // 2. Ищем паттерн user=... (до следующего амперсанда или конца строки)
      // Работает, даже если URLSearchParams ломается
      const match = rawData.match(/user=([^&]+)/)

      if (match && match[1]) {
        console.log('🎯 Regex found user string')

        // Декодируем (превращаем %7B в { и т.д.)
        const decoded = decodeURIComponent(match[1])
        console.log('🔓 Decoded JSON string:', decoded)

        // Парсим
        user.value = JSON.parse(decoded)
        console.log('✅ SUCCESS! User parsed:', user.value)
      } else {
        console.warn('⚠️ "user=" pattern not found in data')
      }
    } catch (e) {
      console.error('❌ JSON Parse Error:', e)
    }

    isReady.value = true
  }

  return { user, userInitials, fullName, initUser }
})
