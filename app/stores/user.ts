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

    console.log('🔄 User Store: Init started...')

    let hash = window.location.hash
    let source = 'url'
    let dataToParse = ''

    // 1. Пытаемся взять из URL
    if (hash && hash.includes('tgWebAppData')) {
      dataToParse = hash
      console.log('📍 Source: URL Hash detected')
    }
    // 2. Если в URL пусто, ищем в SessionStorage (Rescue Script)
    else {
      console.log('⚠️ URL Hash missing or cleaned by router. Checking Backup...')
      const backup = sessionStorage.getItem('tma_init_data_backup')

      if (backup) {
        dataToParse = backup
        source = 'backup'
        console.log('✅ Source: Backup found in sessionStorage')
      } else {
        source = 'none'
        console.log('❌ No data in URL or Backup')
      }
    }

    // 3. Парсинг
    if (source !== 'none' && dataToParse) {
      try {
        // Убираем # если есть
        const cleanHash = dataToParse.startsWith('#') ? dataToParse.slice(1) : dataToParse
        const params = new URLSearchParams(cleanHash)
        const tgWebAppData = params.get('tgWebAppData')

        if (tgWebAppData) {
          const dataParams = new URLSearchParams(tgWebAppData)
          const userJson = dataParams.get('user')
          if (userJson) {
            user.value = JSON.parse(userJson)
            console.log('✅ User parsed successfully:', user.value)
          }
        } else {
            console.error('❌ tgWebAppData param missing in hash')
        }
      } catch (e) {
        console.error('❌ Parse error', e)
      }
    }
    // 4. Dev Mock (Если локально и ничего не нашли)
    else if (import.meta.dev || import.meta.env.DEV) {
      console.log('👨‍💻 Dev Mode: Using Mock User')
      user.value = { id: 1, first_name: 'Dev', last_name: 'Test', is_premium: true }
    }

    isReady.value = true
  }

  return { user, userInitials, fullName, initUser }
})
