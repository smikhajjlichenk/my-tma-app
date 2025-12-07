// plugins/telegram.client.ts
import { defineNuxtPlugin } from '#app'
import { retrieveLaunchParams } from '@tma.js/sdk'
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  const backupKey = 'tma_init_data_backup'

  // 1. MOCK (Dev Only)
  if (import.meta.dev) {
    try {
      mockTelegramEnv({ /* ... твои моки ... */ })
    } catch (e) {}
  }

  // 2. ВОССТАНОВЛЕНИЕ ХЕША (если пропал)
  // Мы уже знаем, что хеш есть, но на всякий случай оставляем логику
  const currentHash = window.location.hash
  if (currentHash && currentHash.length > 10) {
     // Хеш на месте, всё ок
  } else {
    const backup = sessionStorage.getItem(backupKey)
    if (backup && window.location.hash !== backup) {
      window.location.hash = backup
    }
  }

  let lp = undefined
  let source = 'none'

  // 3. ПОПЫТКА ПОЛУЧИТЬ ДАННЫЕ
  try {
    // А. Пробуем официальный метод
    lp = retrieveLaunchParams()
    source = 'sdk_standard'
  } catch (sdkError) {
    console.warn('SDK failed to parse, trying manual fallback...', sdkError)

    // Б. РУЧНОЙ ПАРСИНГ (PLAN B)
    // Если SDK не справился, но хеш есть — парсим сами.
    try {
      const hash = window.location.hash.slice(1) // Убираем #
      const params = new URLSearchParams(hash)

      const tgWebAppData = params.get('tgWebAppData')
      const platform = params.get('tgWebAppPlatform') || 'unknown'

      if (tgWebAppData) {
        // Данные внутри tgWebAppData тоже закодированы, парсим их
        const dataParams = new URLSearchParams(tgWebAppData)
        const userStr = dataParams.get('user')

        if (userStr) {
          const user = JSON.parse(userStr)

          // Собираем объект, похожий на тот, что отдает SDK
          lp = {
            platform: platform,
            initData: {
              user: user
            },
            // Остальные поля можно опустить для UI
          }
          source = 'manual_parsing'
        }
      }
    } catch (manualError) {
      console.error('Manual parsing failed too', manualError)
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
