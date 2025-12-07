export const useTelegram = () => {
  const { $lp } = useNuxtApp()

  // Приведение типов
  const rawLaunchParams = $lp as any

  const user = computed(() => {
    const rawUser = rawLaunchParams?.initData?.user

    // ЛОГ В КОНСОЛЬ (для отладки)
    if (!rawUser) {
      console.log('❌ useTelegram: User is missing in $lp', rawLaunchParams)
      return undefined
    }

    console.log('✅ useTelegram: Found raw user:', rawUser)

    // ВОЗВРАЩАЕМ ГИБРИДНЫЙ ОБЪЕКТ
    // ...rawUser -> сохраняет first_name, last_name (как пришло из ТГ)
    // firstName: ... -> добавляет удобный camelCase
    return {
      ...rawUser,
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
