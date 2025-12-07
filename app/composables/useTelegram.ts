// Мы не импортируем User из SDK, чтобы не зависеть от их определений типов.
// Мы определим свой "грязный" тип, который покрывает все варианты.

// 1. Тип для входящего "сырого" юзера (может быть camelCase или snake_case)
type AnyUser = {
  id: number
  firstName?: string
  first_name?: string
  lastName?: string
  last_name?: string
  username?: string
  isPremium?: boolean
  is_premium?: boolean
  photo_url?: string
  photoUrl?: string
}

// 2. Тип для "чистого" юзера, который мы отдаем в приложение
interface UnifiedUser {
  id: number
  firstName: string
  lastName: string
  username?: string
  isPremium: boolean
  photoUrl?: string
}

export const useTelegram = () => {
  const { $lp } = useNuxtApp()

  // Приводим к any, чтобы достать initData, а потом кастуем к нашему AnyUser
  // Это безопасно, так как мы проверяем поля ниже
  const rawLaunchParams = $lp as any

  const user = computed<UnifiedUser | undefined>(() => {
    const rawUser = rawLaunchParams?.initData?.user as AnyUser | undefined

    if (!rawUser) return undefined

    // НОРМАЛИЗАЦИЯ:
    // Берем camelCase (если SDK) ИЛИ snake_case (если ручной парсинг/API)
    return {
      id: rawUser.id,
      firstName: rawUser.firstName || rawUser.first_name || '',
      lastName: rawUser.lastName || rawUser.last_name || '',
      username: rawUser.username,
      isPremium: rawUser.isPremium || rawUser.is_premium || false,
      photoUrl: rawUser.photoUrl || rawUser.photo_url
    }
  })

  const platform = (rawLaunchParams?.platform as string) || 'unknown'

  return {
    user,
    platform,
    isPremium: computed(() => user.value?.isPremium || false)
  }
}
