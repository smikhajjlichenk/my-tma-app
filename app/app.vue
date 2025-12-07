<script setup lang="ts">
import { Wallet, History, MessageSquare, Zap, Settings, User as UserIcon } from 'lucide-vue-next'

// --- 1. Интерфейсы ---
interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  is_premium?: boolean
}

// --- 2. Состояние ---
const rawUser = ref<User | undefined>(undefined)
const debugLog = ref<string>('Vue Init...')

// --- 3. Логика парсинга (встроенная) ---
const parseUser = (hash: string): User | undefined => {
  try {
    // Убираем #
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    const params = new URLSearchParams(cleanHash)
    const tgWebAppData = params.get('tgWebAppData')

    if (!tgWebAppData) return undefined

    const dataParams = new URLSearchParams(tgWebAppData)
    const userJson = dataParams.get('user')

    if (!userJson) return undefined

    return JSON.parse(userJson)
  } catch (e) {
    console.error('Parse error:', e)
    return undefined
  }
}

onMounted(() => {
  // ШАГ 1: Проверяем URL
  let hash = window.location.hash
  let source = 'url'

  // ШАГ 2: Если URL пуст, проверяем Backup (SessionStorage)
  if (!hash || !hash.includes('tgWebAppData')) {
    const backup = sessionStorage.getItem('tma_init_data_backup')
    if (backup) {
      hash = backup
      source = 'backup'
    } else {
      source = 'none'
    }
  }

  // ШАГ 3: Парсим
  if (source !== 'none') {
    const user = parseUser(hash)
    if (user) {
      rawUser.value = user
      debugLog.value = `✅ SUCCESS (${source}). User: ${user.first_name} (ID: ${user.id})`
    } else {
      debugLog.value = `❌ PARSE FAIL. Hash found but user missing.`
    }
  } else if (import.meta.dev) {
    // DEV MODE
    debugLog.value = '⚠️ DEV MODE. Using Mock.'
    rawUser.value = { id: 1, first_name: 'Andrew', last_name: 'Dev', is_premium: true }
  } else {
    // FAIL
    debugLog.value = `❌ FATAL. No data in URL or Backup. Redirected?`
  }
})

// --- 4. Данные для UI ---
// Нормализуем данные для шаблона (чтобы работало везде)
const user = computed(() => {
  if (!rawUser.value) return undefined
  return {
    firstName: rawUser.value.first_name,
    lastName: rawUser.value.last_name || '',
    initials: (rawUser.value.first_name[0] || '?').toUpperCase()
  }
})

const balance = 1250.50
const menuItems = [
  { label: 'AI Chat', icon: MessageSquare, color: 'bg-blue-500' },
  { label: 'Wallet', icon: Wallet, color: 'bg-purple-500' },
  { label: 'History', icon: History, color: 'bg-green-500' },
  { label: 'Fast Action', icon: Zap, color: 'bg-yellow-500' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">

    <!-- DEBUG PANEL: Если видишь этот текст, значит скрипт отработал -->
    <div class="bg-black text-green-400 p-2 text-[10px] font-mono break-all border-b border-green-900 leading-tight">
      {{ debugLog }}
    </div>

    <!-- HEADER -->
    <header class="p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm text-lg">
           {{ user?.initials || '?' }}
        </div>
        <div>
          <p class="text-xs text-gray-500 font-medium">Welcome back,</p>
          <h1 class="font-bold text-xl leading-tight text-gray-800">
            {{ user?.firstName || 'Guest' }}
          </h1>
        </div>
      </div>
      <button class="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-transform">
        <Settings class="w-5 h-5 text-gray-500" />
      </button>
    </header>

    <!-- Остальной UI без изменений (карточки, кнопки) -->
    <!-- (Вставь сюда код Balance Card и Grid из прошлого ответа, он рабочий) -->
    <div class="px-5 mt-1">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
        <p class="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <span class="text-4xl font-bold tracking-tight relative z-10">${{ balance.toLocaleString() }}</span>
      </div>
    </div>

    <div class="px-5 mt-8">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4">
        <button v-for="item in menuItems" :key="item.label" class="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-col items-center justify-center gap-3">
          <div :class="[item.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white']">
            <component :is="item.icon" class="w-6 h-6" />
          </div>
          <span class="font-medium text-sm text-gray-600">{{ item.label }}</span>
        </button>
      </div>
    </div>
    <!-- BOTTOM TAB BAR -->
    <nav class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-2 flex justify-around items-center pb-safe z-50">
       <button class="flex flex-col items-center text-blue-600 p-2 transition active:scale-90">
         <!-- Вот здесь используется UserIcon -->
         <UserIcon class="w-6 h-6 stroke-[2.5]" />
         <span class="text-[10px] font-bold mt-1">Home</span>
       </button>

       <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 p-2 transition active:scale-90">
         <History class="w-6 h-6 stroke-[2.5]" />
         <span class="text-[10px] font-medium mt-1">Activity</span>
       </button>
    </nav>
  </div>
</template>
<style>
/* Чтобы на айфонах нижняя полоска не перекрывала контент */
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
