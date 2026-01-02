// 1. Расширяем интерфейс Window локально, чтобы TS знал про webkit-версию
interface IWindow extends Window {
  SpeechRecognition?: { new(): SpeechRecognition }
  webkitSpeechRecognition?: { new(): SpeechRecognition }
}

export function useSpeechRecognition() {
  const isSupported = ref(false)
  const isListening = ref(false)
  const error = ref<string | null>(null)

  // 2. Типизируем ref как стандартный SpeechRecognition или null
  const recognition = shallowRef<SpeechRecognition | null>(null)

  onMounted(() => {
    // Безопасное приведение window
    const _window = window as unknown as IWindow
    const SpeechRecognitionConstructor = _window.SpeechRecognition || _window.webkitSpeechRecognition

    if (SpeechRecognitionConstructor) {
      isSupported.value = true
      const instance = new SpeechRecognitionConstructor()

      instance.lang = 'ru-RU'
      instance.continuous = false
      instance.interimResults = true

      instance.onstart = () => {
        console.log('🎤 Speech started')
        isListening.value = true
        error.value = null
      }

      instance.onend = () => {
        console.log('🛑 Speech ended')
        isListening.value = false
      }

      // Используем стандартный тип события ошибки
      instance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('⚠️ Speech error:', event.error)
        isListening.value = false
        // event.error возвращает тип SpeechRecognitionErrorCode (строковый enum)
        error.value = event.error
      }

      recognition.value = instance
    }
  })

  onUnmounted(() => {
    if (recognition.value && isListening.value) {
      recognition.value.stop()
    }
  })

  const toggle = () => {
    if (!recognition.value) return
    isListening.value ? recognition.value.stop() : recognition.value.start()
  }

  return {
    isSupported,
    isListening,
    error,
    recognition,
    toggle
  }
}
