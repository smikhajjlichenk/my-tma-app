import { defineNuxtPlugin } from '#app'
import { retrieveLaunchParams } from '@tma.js/sdk' // Убрали лишние импорты
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  const backupKey = 'tma_init_data_backup'

  // 1. MOCK (Dev Only)
  if (import.meta.dev) {
    try {
      mockTelegramEnv({
        launchParams: {
          tgWebAppData: 'user=%7B%22id%22%3A99281932%2C%22first_name%22%3A%22Andrew%22%2C%22last_name%22%3A%22Dev%22%2C%22username%22%3A%22rogue%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8446398900545146168&chat_type=sender&auth_date=1716922846&hash=d4d59a24312090977986e41291a161596476a82c42326d6a78e39973803d0392',
          tgWebAppThemeParams: { bg_color: "#ffffff", button_text_color: "#ffffff" },
          tgWebAppVersion: '7.2',
          tgWebAppPlatform: 'tdesktop'
        }
      })
    } catch (e) {}
  }

  // 2. ИЩЕМ ДАННЫЕ
  let lp = undefined
  let source = 'none'

  // Хелпер для безопасного вызова
  const tryGetParams = () => {
    try {
      return retrieveLaunchParams()
    } catch (e) {
      return undefined
    }
  }

  // Попытка 1: Читаем то, что есть в браузере прямо сейчас
  lp = tryGetParams()

  if (lp) {
    source = 'url_direct'
  } else {
    // Попытка 2: Если пусто, проверяем наш бэкап (который сохранил скрипт в head)
    const backup = sessionStorage.getItem(backupKey)

    if (backup) {
      // Если URL пуст, а бэкап есть — ВОССТАНАВЛИВАЕМ ХЕШ БРАУЗЕРА
      // Это заставит SDK увидеть данные
      if (window.location.hash !== backup) {
        window.location.hash = backup
      }

      // И пробуем снова через SDK
      lp = tryGetParams()
      if (lp) source = 'restored_backup'
    }
  }

  console.log(`✅ TMA Plugin finished. Source: ${source}`)

  return {
    provide: {
      lp: lp,
      debugSource: source
    }
  }
})
