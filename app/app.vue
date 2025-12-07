<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { User } from '@tma.js/sdk'
import { Wallet, History, MessageSquare, Zap, Settings, User as UserIcon } from 'lucide-vue-next'

// --- СОСТОЯНИЕ ---
const rawUser = ref<User | undefined>(undefined)
const debugLog = ref<string>('Vue Init...')

// --- ЛОГИКА ---
onMounted(() => {
  // 1. Достаем данные, которые подготовил наш плагин (telegram.client.ts)
  // Используем 'as any', так как мы не типизировали provide глобально (это ок для старта)
  const { $lp, $debugSource } = useNuxtApp() as any

  // Для диагностики: смотрим, что реально сейчас в строке браузера
  const currentHash = window.location.hash
  const currentUrl = window.location.href

  if ($lp && $lp.platform) {
    // УСПЕХ: Плагин смог найти параметры (в URL или в бэкапе)
    debugLog.value = `✅ OK. Src: ${$debugSource}. Plat: ${$lp.platform}`

    // Безопасно достаем объект юзера
    const data = $lp.initData as { user?: User } | undefined

    if (data?.user) {
      rawUser.value = data.user
      debugLog.value += ` | User: ${data.user.id}`
    } else {
      debugLog.value += ` | ⚠️ User obj missing`
    }
  }
  else if (import.meta.dev) {
    // ЛОКАЛЬНАЯ РАЗРАБОТКА: Моки
    debugLog.value = '💻 DEV MODE (Mock Data)'
    rawUser.value = {
      id: 777,
      first_name: 'Andrew',
      last_name: 'Dev',
      username: 'andrew_dev',
      language_code: 'en',
      is_premium: true
    } as User
  }
  else {
    // ОШИБКА: Данных нет нигде
    // Показываем хвост URL, чтобы понять, срезал ли Vercel хеш
    const urlTail = currentUrl.slice(-50)
    debugLog.value = `❌ FAIL. Hash: "${currentHash}". URL: ...${urlTail}`
  }
})

// Обертка для удобства в шаблоне
const user = computed(() => rawUser.value)

// Данные интерфейса
const balance = 1250.50
const menuItems = [
  { label: 'AI Chat', icon: MessageSquare, color: 'bg-blue-500' },
  { label: 'Wallet', icon: Wallet, color: 'bg-purple-500' },
  { label: 'History', icon: History, color: 'bg-green-500' },
  { label: 'Fast Action', icon: Zap, color: 'bg-yellow-500' },
]
</script>

<template>
  <!-- Основной контейнер с учетом цвета фона -->
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">

    <!-- 🔴 DEBUG PANEL (Видна всегда, чтобы ты мог прислать мне скриншот) -->
    <div class="bg-black text-green-400 p-2 text-[10px] font-mono break-all border-b border-green-900 leading-tight sticky top-0 z-50">
      {{ debugLog }}
    </div>

    <!-- HEADER -->
    <header class="p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Аватар (Первая буква имени) -->
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200 shadow-sm">
           {{ user?.first_name?.[0] || '?' }}
        </div>

        <!-- Приветствие -->
        <div>
          <p class="text-xs text-gray-500 font-medium">Welcome back,</p>
          <h1 class="font-bold text-lg leading-tight text-gray-800">
            {{ user?.first_name || 'Guest' }} {{ user?.last_name || '' }}
          </h1>
        </div>
      </div>

      <!-- Кнопка настроек -->
      <button class="p-2 bg-white rounded-full shadow-sm border border-gray-100 active:scale-95 transition hover:bg-gray-50">
        <Settings class="w-5 h-5 text-gray-600" />
      </button>
    </header>

    <!-- BALANCE CARD -->
    <div class="px-4 mt-2">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden transform transition hover:scale-[1.01]">
        <!-- Декоративные круги -->
        <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <p class="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <div class="flex items-baseline gap-1 relative z-10">
          <span class="text-3xl font-bold tracking-tight">${{ balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
        </div>

        <!-- Кнопки действий внутри карточки -->
        <div class="mt-6 flex gap-3 relative z-10">
          <button class="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md py-2.5 rounded-xl text-sm font-semibold transition border border-white/10 shadow-inner">
            Deposit
          </button>
          <button class="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md py-2.5 rounded-xl text-sm font-semibold transition border border-white/10 shadow-inner">
            Withdraw
          </button>
        </div>
      </div>
    </div>

    <!-- ACTION GRID -->
    <div class="px-4 mt-8">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition hover:shadow-md hover:border-blue-100 group"
        >
          <div :class="[item.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition group-hover:scale-110']">
            <component :is="item.icon" class="w-6 h-6" />
          </div>
          <span class="font-medium text-sm text-gray-700 group-hover:text-blue-600 transition">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- BOTTOM TAB BAR -->
    <nav class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-2 flex justify-around items-center pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
       <button class="flex flex-col items-center text-blue-600 p-2 active:scale-90 transition">
         <UserIcon class="w-6 h-6 stroke-[2.5]" />
         <span class="text-[10px] font-bold mt-0.5">Home</span>
       </button>
       <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 p-2 active:scale-90 transition">
         <History class="w-6 h-6 stroke-[2.5]" />
         <span class="text-[10px] font-medium mt-0.5">Activity</span>
       </button>
    </nav>

  </div>
</template>

<style>
/* CSS Hack для iOS устройств (учитывает полоску снизу) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
