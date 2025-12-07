import { retrieveLaunchParams, type LaunchParams } from '@tma.js/sdk'
import { mockTelegramEnv } from '@tma.js/bridge'

/**
 * Ручной парсер на случай, если SDK не справился с форматом Vercel/Router
 */
function manualParse(hash: string): LaunchParams | undefined {
  try {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    const params = new URLSearchParams(cleanHash)

    const tgWebAppData = params.get('tgWebAppData')
    const platform = params.get('tgWebAppPlatform') || 'unknown'
    const version = params.get('tgWebAppVersion') || '7.0'

    if (!tgWebAppData) return undefined

    const dataParams = new URLSearchParams(tgWebAppData)
    const userJson = dataParams.get('user')

    // Собираем объект
    const manuallyParsed = {
      platform,
      version,
      // Важно: добавляем пустой объект темы, чтобы не крашилось при доступе
      themeParams: {},
      initData: {
        user: userJson ? JSON.parse(userJson) : undefined
      },
      // Можно добавить initDataRaw, если нужно
      initDataRaw: tgWebAppData
    }

    // 👇 ФИКС ОШИБКИ: Сначала приводим к unknown, потом к целевому типу
    return manuallyParsed as unknown as LaunchParams

  } catch (e) {
    console.error('Manual parse failed:', e)
    return undefined
  }
}

export default defineNuxtPlugin(() => {
  // 1. MOCK ENVIRONMENT (Dev Only)
  if (import.meta.dev) {
    try {
      mockTelegramEnv({
        launchParams: {
          tgWebAppData: 'user=%7B%22id%22%3A777%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22developer%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&tgWebAppVersion=7.2&tgWebAppPlatform=tdesktop',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '7.2',
          tgWebAppPlatform: 'tdesktop'
        }
      })
    } catch (e) {}
  }

  // 2. LOGIC
  let lp: LaunchParams | undefined
  let source = 'none'

  // Пытаемся через SDK
  try {
    lp = retrieveLaunchParams()
    source = 'sdk'
  } catch (e) {
    // Пытаемся вручную (Backup Plan)
    const hash = window.location.hash || sessionStorage.getItem('tma_backup') || ''
    if (hash) {
      lp = manualParse(hash)
      if (lp) source = 'manual_fallback'
    }
  }

  // Лог для продакшена (можно убрать потом)
  console.log(`[TMA Init] Source: ${source}`, lp)

  return {
    provide: {
      lp,
      debugSource: source
    }
  }
})
