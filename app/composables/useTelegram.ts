import type { User } from '@tma.js/sdk'

// 1. Определяем упрощенный интерфейс того, что мы ожидаем от плагина.
// Это избавляет нас от борьбы со сложными типами SDK.
interface TelegramLaunchParams {
  platform?: string
  version?: string
  initData?: {
    user?: User
  }
}

export const useTelegram = () => {
  const { $lp } = useNuxtApp()

  // 2. Приводим полученный объект к нашему интерфейсу
  const lp = $lp as TelegramLaunchParams | undefined

  // 3. Реактивный юзер
  const user = computed<User | undefined>(() => {
    return lp?.initData?.user
  })

  // 4. Другие данные
  const platform = lp?.platform || 'unknown'

  // 5. Проверка премиума (безопасное чтение свойства)
  const isPremium = computed(() => {
    return !!user.value?.is_premium
  })

  return {
    user,
    platform,
    isPremium
  }
}
