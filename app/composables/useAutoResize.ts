export const useAutoResize = (text: Ref<string>) => {
  const textarea = ref<HTMLTextAreaElement | null>(null)

  const resize = () => {
    const el = textarea.value
    if (!el) return

    // 1. Сбрасываем высоту, чтобы правильно рассчитать scrollHeight при уменьшении текста
    el.style.height = 'auto'

    // 2. Ставим новую высоту (scrollHeight = реальная высота контента)
    // 24px - это примерная высота одной строки (зависит от line-height), чтобы не хлопало
    el.style.height = `${el.scrollHeight}px`
  }

  // Следим за изменением текста программно (например, после отправки сообщения очищаем поле)
  watch(text, async () => {
    await nextTick() // Ждем, пока Vue обновит DOM
    resize()
  })

  return {
    textarea,
    resize
  }
}
