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

  // Getters (Computed)
  const userInitials = computed(() => (user.value?.first_name[0] || '?').toUpperCase())
  const fullName = computed(() => user.value?.first_name || 'Guest')

  // Actions
  const initUser = () => {
    if (isReady.value) return

    let hash = window.location.hash
    let source = 'url'

    // 1. Rescue Logic
    if (!hash || !hash.includes('tgWebAppData')) {
      const backup = sessionStorage.getItem('tma_init_data_backup')
      if (backup) {
        hash = backup
        source = 'backup'
      } else {
        source = 'none'
      }
    }

    // 2. Parse Logic
    if (source !== 'none') {
      try {
        const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
        const params = new URLSearchParams(cleanHash)
        const tgWebAppData = params.get('tgWebAppData')

        if (tgWebAppData) {
          const dataParams = new URLSearchParams(tgWebAppData)
          const userJson = dataParams.get('user')
          if (userJson) {
            user.value = JSON.parse(userJson)
          }
        }
      } catch (e) {
        console.error('Parse error', e)
      }
    } else if (import.meta.dev) {
      // Mock for Dev
      user.value = { id: 1, first_name: 'Dev', last_name: 'User', is_premium: true }
    }

    isReady.value = true
  }

  return { user, userInitials, fullName, initUser }
})
