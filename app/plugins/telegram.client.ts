// plugins/telegram.client.ts
import { defineNuxtPlugin } from '#app'
import { retrieveLaunchParams } from '@tma.js/sdk'
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Mocks (оставляем для локалки)
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

  // 2. Инициализация (ТЕПЕРЬ БЕЗОПАСНА)
  // Благодаря скрипту в nuxt.config, здесь ВСЕГДА будет хеш, если это ТМА.
  let lp = undefined
  try {
    lp = retrieveLaunchParams()
    console.log('✅ SDK Init Params:', lp)
  } catch (e) {
    console.error('⚠️ Failed to retrieve params:', e)
  }

  return {
    provide: { lp }
  }
})
