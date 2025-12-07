<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { User } from '@tma.js/sdk'
import { Wallet, History, MessageSquare, Zap, Settings, User as UserIcon } from 'lucide-vue-next'

// --- STATE ---
const rawUser = ref<User | undefined>(undefined)
const debugLog = ref<string>('Vue Init...')

// --- LOGIC ---
onMounted(() => {
  // 1. Получаем данные из плагина (он запустился раньше Роутера и сохранил хеш)
  const { $lp } = useNuxtApp() as any // as any чтобы TS не ругался на кастомное свойство

  if ($lp && $lp.platform) {
    // ВАРИАНТ 1: Успех (Данные пришли из плагина)
    debugLog.value = `✅ FROM PLUGIN. Plat: ${$lp.platform}`

    // Безопасно достаем юзера
    const data = $lp.initData as { user?: User } | undefined

    if (data?.user) {
      rawUser.value = data.user
      debugLog.value += ` | User: ${data.user.id}`
    } else {
      debugLog.value += ` | User Missing inside LP`
    }
  }
  else if (import.meta.dev) {
    // ВАРИАНТ 2: Локальная разработка (Mock Data)
    debugLog.value = 'DEV MODE (Mock Data Active)'
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
    // ВАРИАНТ 3: Ошибка (Открыто не через бота или редирект съел хеш)
    debugLog.value = `❌ NO DATA from Plugin. URL Hash empty?`
  }
})

// Computed обертка
const user = computed(() => rawUser.value)

// Фейковый баланс
const balance = 1250.50

// Меню действий
const menuItems = [
  { label: 'AI Chat', icon: MessageSquare, color: 'bg-blue-500' },
  { label: 'Wallet', icon: Wallet, color: 'bg-purple-500' },
  { label: 'History', icon: History, color: 'bg-green-500' },
  { label: 'Fast Action', icon: Zap, color: 'bg-yellow-500' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">

    <!-- 🔴 DEBUG PANEL (Для отладки на телефоне) -->
    <div class="bg-black text-green-400 p-2 text-[10px] font-mono break-all border-b border-green-900 leading-tight">
      DEBUG: {{ debugLog }}
    </div>

    <!-- HEADER -->
    <header class="p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Аватар -->
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
           {{ user?.first_name?.[0] || '?' }}
        </div>

        <!-- Имя -->
        <div>
          <p class="text-xs text-gray-500">Welcome back,</p>
          <h1 class="font-bold text-lg leading-tight">
            {{ user?.first_name || 'Guest' }} {{ user?.last_name || '' }}
          </h1>
        </div>
      </div>

      <!-- Кнопка настроек -->
      <button class="p-2 bg-white rounded-full shadow-sm active:scale-95 transition">
        <Settings class="w-5 h-5 text-gray-600" />
      </button>
    </header>

    <!-- BALANCE CARD -->
    <div class="px-4 mt-2">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
        <!-- Декор -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

        <p class="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <div class="flex items-baseline gap-1 relative z-10">
          <span class="text-3xl font-bold">${{ balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
        </div>

        <div class="mt-4 flex gap-3 relative z-10">
          <button class="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md py-2 rounded-lg text-sm font-medium transition">
            Deposit
          </button>
          <button class="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md py-2 rounded-lg text-sm font-medium transition">
            Withdraw
          </button>
        </div>
      </div>
    </div>

    <!-- ACTION GRID -->
    <div class="px-4 mt-8">
      <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition hover:shadow-md"
        >
          <div :class="[item.color, 'w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm']">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <span class="font-medium text-sm text-gray-700">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- BOTTOM TAB BAR (Visual) -->
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center pb-safe z-50">
       <button class="flex flex-col items-center text-blue-600">
         <UserIcon class="w-6 h-6" />
         <span class="text-[10px] font-medium mt-1">Home</span>
       </button>
       <button class="flex flex-col items-center text-gray-400 hover:text-gray-600">
         <History class="w-6 h-6" />
         <span class="text-[10px] font-medium mt-1">Activity</span>
       </button>
    </nav>

  </div>
</template>

<style>
/* Учет "челки" и Home Indicator на iOS */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
