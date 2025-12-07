// --- 1. Вспомогательная функция парсинга (внутри файла) ---
function manualParse(hash: string) {
  try {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    const params = new URLSearchParams(cleanHash)

    const tgWebAppData = params.get('tgWebAppData')
    const platform = params.get('tgWebAppPlatform') || 'unknown'

    if (!tgWebAppData) return null

    const dataParams = new URLSearchParams(tgWebAppData)
    const userJson = dataParams.get('user')

    if (!userJson) return null

    return {
      platform,
      initData: {
        user: JSON.parse(userJson)
      }
    }
  } catch (e) {
    console.error('Composable parsing failed:', e)
    return null
  }
}

// --- 2. Основной Composable ---
export const useTelegram = () => {
  const { $lp } = useNuxtApp() as any

  // ШАГ 1: Ищем данные везде, где только можно
  let launchParams = $lp

  // Если плагин не передал данные, пробуем найти их сами (Brute Force)
  if (!launchParams && import.meta.client) {
    // Сначала смотрим в URL
    const hash = window.location.hash
    if (hash.includes('tgWebAppData')) {
      launchParams = manualParse(hash)
    }
    // Если нет, смотрим в бэкап (который сделал скрипт в nuxt.config)
    else {
      const backup = sessionStorage.getItem('tma_init_data_backup')
      if (backup) {
        launchParams = manualParse(backup)
      }
    }
  }

  // ШАГ 2: Формируем реактивного юзера
  const user = computed(() => {
    const rawUser = launchParams?.initData?.user

    if (!rawUser) return undefined

    // Нормализация (snake_case -> camelCase)
    return {
      ...rawUser, // сохраняем оригинальные поля
      id: rawUser.id,
      firstName: rawUser.firstName || rawUser.first_name || '',
      lastName: rawUser.lastName || rawUser.last_name || '',
      username: rawUser.username,
      isPremium: rawUser.isPremium || rawUser.is_premium || false,
      photoUrl: rawUser.photoUrl || rawUser.photo_url
    }
  })

  const platform = launchParams?.platform || 'unknown'

  return {
    user,
    platform,
    isPremium: computed(() => user.value?.isPremium || false)
  }
}
