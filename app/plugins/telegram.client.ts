import { defineNuxtPlugin } from '#app'
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  // 1. MOCK (Dev Only)
  if (import.meta.dev) {
    try {
       // Оставляем моки, чтобы работало на localhost
       mockTelegramEnv({
        launchParams: {
          tgWebAppData: 'user=%7B%22id%22%3A99%2C%22first_name%22%3A%22Dev%22%7D&hash=123',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '7.0',
          tgWebAppPlatform: 'tdesktop'
        }
      })
    } catch (e) {}
  }

  // 2. ВОССТАНОВЛЕНИЕ ХЕША (Backup Logic)
  const backupKey = 'tma_init_data_backup'
  let currentHash = window.location.hash

  if (!currentHash || currentHash.length < 10) {
    const backup = sessionStorage.getItem(backupKey)
    if (backup) {
      currentHash = backup
      // Возвращаем в URL для красоты (не обязательно, но полезно)
      window.location.hash = backup
    }
  }

  // 3. ПАРСИНГ (Самая важная часть)
  let lp = undefined
  let source = 'none'

  if (currentHash && currentHash.includes('tgWebAppData')) {
    try {
      // Убираем решетку в начале, если есть
      const cleanHash = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash

      // Первый уровень парсинга: разбираем параметры запуска
      const urlParams = new URLSearchParams(cleanHash)
      const tgWebAppData = urlParams.get('tgWebAppData') // Это тоже закодированная строка!
      const platform = urlParams.get('tgWebAppPlatform') || 'unknown'

      if (tgWebAppData) {
        // Второй уровень парсинга: разбираем данные внутри tgWebAppData
        const dataParams = new URLSearchParams(tgWebAppData)
        const userJson = dataParams.get('user')

        if (userJson) {
          const user = JSON.parse(userJson)

          // Собираем объект вручную, имитируя SDK
          lp = {
            platform: platform,
            initData: {
              user: user
            }
          }
          source = 'manual_success'
        }
      }
    } catch (e) {
      console.error('Manual parsing error:', e)
    }
  }

  console.log(`✅ TMA Plugin finished. Source: ${source}`, lp)

  return {
    provide: {
      lp: lp,
      debugSource: source
    }
  }
})
