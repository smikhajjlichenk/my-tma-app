import { defineNuxtPlugin } from '#app'
import { init, miniApp, backButton } from '@tma.js/sdk-vue'
import { retrieveLaunchParams } from '@tma.js/sdk' // Импортируем из ядра
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  // 1. MOCK (Dev Only) - Оставляем как было
  if (import.meta.dev) {
    try {
      console.log('🔧 Initializing Mock...')
      mockTelegramEnv({
        launchParams: {
          tgWebAppData: 'user=%7B%22id%22%3A99281932%2C%22first_name%22%3A%22Andrew%22%2C%22last_name%22%3A%22Dev%22%2C%22username%22%3A%22rogue%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8446398900545146168&chat_type=sender&auth_date=1716922846&hash=d4d59a24312090977986e41291a161596476a82c42326d6a78e39973803d0392',
          tgWebAppThemeParams: {
             bg_color: "#ffffff", button_color: "#2481cc", button_text_color: "#ffffff"
          },
          tgWebAppVersion: '7.2',
          tgWebAppPlatform: 'tdesktop'
        }
      })
    } catch (error) {
      console.error('❌ Mock failed:', error)
    }
  }

  // 2. Инициализация компонентов (Visual)
  try {
    init()
    if (miniApp.isSupported()) miniApp.mount()
    if (backButton.isSupported()) backButton.mount()
  } catch (error) {
    console.error('Components Init Error:', error)
  }

  // 3. ЗАХВАТ ДАННЫХ (Critical Step)
  // Мы получаем параметры здесь, пока URL еще "целый"
  let lp = undefined
  try {
    lp = retrieveLaunchParams()
    console.log('✅ LP Retrieved inside Plugin:', lp.platform)
  } catch (e) {
    console.warn('⚠️ No Launch Params found (Browser mode?)')
  }

  // 4. PROVIDE - Делаем данные доступными во всем приложении через $lp
  return {
    provide: {
      lp: lp // Будет доступно как useNuxtApp().$lp
    }
  }
})
