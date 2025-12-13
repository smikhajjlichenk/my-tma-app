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

    console.log('🕵️‍♂️ User Store: Init...')

    const hash = window.location.hash
    const backup = sessionStorage.getItem('tma_init_data_backup')
    let sourceRaw = ''

    // 1. Приоритет: Данные в URL (если они там есть)
    if (hash && hash.includes('tgWebAppData')) {
      sourceRaw = hash
      console.log('📍 Source: Fresh URL Hash')
    }
    // 2. Фолбек: Данные из Rescue Script (если URL уже чист)
    else if (backup && backup.includes('tgWebAppData')) {
      sourceRaw = backup
      console.log('📍 Source: Backup (Rescue Script)')
    }

    // 3. Если пусто — выходим (или мок)
    if (!sourceRaw) {
      console.log('❌ No data found anywhere')
      if (import.meta.dev) {
         user.value = { id: 777, first_name: 'Dev', last_name: 'Hunter', is_premium: true }
      }
      isReady.value = true
      return
    }

    // 4. Regex Hunter (Вырезаем JSON из любой каши)
    try {
      const match = sourceRaw.match(/user=([^&]+)/)
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1])
        user.value = JSON.parse(decoded)
        console.log('✅ User Loaded:', user.value?.first_name)
      } else {
        console.warn('⚠️ Pattern not found')
      }
    } catch (e) {
      console.error('❌ Parse Error:', e)
    }

    isReady.value = true
  }

  return { user, userInitials, fullName, initUser }
})
