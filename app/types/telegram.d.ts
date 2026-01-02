// types/telegram.d.ts
export {}

declare global {
  // 1. Интерфейс пользователя Telegram
  interface WebAppUser {
    id: number
    is_bot?: boolean
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
    added_to_attachment_menu?: boolean
    allows_write_to_pm?: boolean
    photo_url?: string
  }

  // 2. Интерфейс чата (если бот открыт из меню аттачментов)
  interface WebAppChat {
    id: number
    type: 'group' | 'supergroup' | 'channel'
    title: string
    username?: string
    photo_url?: string
  }

  // 3. Основной объект initDataUnsafe
  interface WebAppInitData {
    query_id?: string
    user?: WebAppUser
    receiver?: WebAppUser
    chat?: WebAppChat
    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
    chat_instance?: string
    start_param?: string
    can_send_after?: number
    auth_date: number
    hash: string
  }

  // 4. Глобальный объект Window
  interface Window {
    Telegram?: {
      WebApp: {
        // Haptic Feedback
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }

        // Данные инициализации
        initData: string
        initDataUnsafe: WebAppInitData // <--- Теперь здесь строгий тип!

        // UI & System
        ready: () => void
        expand: () => void
        close: () => void
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        isClosingConfirmationEnabled: boolean

        // Методы
        enableClosingConfirmation: () => void
        disableClosingConfirmation: () => void
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
        sendData: (data: string) => void
      }
    }
  }
}
