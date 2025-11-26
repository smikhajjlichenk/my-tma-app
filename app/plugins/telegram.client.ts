import { init, miniApp, backButton } from '@tma.js/sdk-vue'
// ВАЖНО: Импорт из bridge
import { mockTelegramEnv } from '@tma.js/bridge'

export default defineNuxtPlugin((nuxtApp) => {
  // 1. MOCK ENVIRONMENT (DEV ONLY)
  if (import.meta.dev) {
    try {
      console.log('🔧 Initializing Telegram Mock via Bridge...')

      // Мы передаем параметры запуска так, как будто они пришли из URL
      mockTelegramEnv({
        launchParams: {
          tgWebAppData: 'user=%7B%22id%22%3A99281932%2C%22first_name%22%3A%22Andrew%22%2C%22last_name%22%3A%22Rogue%22%2C%22username%22%3A%22rogue%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8446398900545146168&chat_type=sender&auth_date=1716922846&hash=d4d59a24312090977986e41291a161596476a82c42326d6a78e39973803d0392&signature=664074726879266742757a2b4f35525265614c4e75594f4c653045496351536634685350424e57755976493d',
          tgWebAppThemeParams: {
             bg_color: "#ffffff",
             text_color: "#000000",
             hint_color: "#999999",
             link_color: "#2481cc",
             button_color: "#2481cc",
             button_text_color: "#ffffff"
          },
          tgWebAppVersion: '7.2',
          tgWebAppPlatform: 'tdesktop'
        }
      })

      console.log('✅ Mock Environment set')
    } catch (error) {
      console.error('❌ Mock failed:', error)
    }
  }

  // 2. INITIALIZATION
  try {
    // Теперь init() успешно "постучится" в наш фейковый bridge
    init()

    if (miniApp.isSupported()) {
      miniApp.mount()
      console.log('🎨 MiniApp Mounted')
    }

    if (backButton.isSupported()) {
      backButton.mount()
    }

    console.log('✅ TMA SDK initialized!')
  } catch (error) {
    console.error('🚨 SDK Init Error:', error)
  }
})
