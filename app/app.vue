<script setup lang="ts">
import { computed } from 'vue'
import { retrieveLaunchParams, type User } from '@tma.js/sdk'
import { Wallet, History, MessageSquare, Zap, Settings } from 'lucide-vue-next'

// 1. Пытаемся достать параметры (сработает в Телеграме)
// Если мы локально и хеша нет, эта функция может вернуть ошибку или пустой объект.
// Поэтому обернем в try/catch для безопасности.
let lp: any = {}
try {
  lp = retrieveLaunchParams()
} catch (e) {
  console.warn('⚠️ Нет параметров запуска (это нормально на localhost)')
}

// 2. Умное вычисление юзера
const user = computed<User | undefined>(() => {
  // А. Пробуем достать реального юзера (если мы в ТГ)
  const realUser = (lp.initData as { user?: User } | undefined)?.user

  if (realUser) return realUser

  // Б. ФОЛБЭК ДЛЯ DEV (Если реального нет, и мы на локалхосте — отдаем фейк)
  if (import.meta.dev) {
    return {
      id: 123456,
      first_name: 'Andrew', // Имя для теста
      last_name: 'Dev',
      username: 'andrew_dev',
      language_code: 'en',
      is_premium: true
    } as User
  }

  return undefined
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
  <!-- Main Container: h-screen чтобы занять весь экран TMA, overflow-hidden чтобы не скроллилось лишнее -->
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">

    <!-- HEADER -->
    <header class="p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Аватар заглушка (или user.photo_url если есть) -->
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {{ user?.first_name?.[0] || 'U' }}
        </div>
        <div>
          <p class="text-xs text-gray-500">Welcome back,</p>
          <h1 class="font-bold text-lg leading-tight">
            {{ user?.first_name || 'Guest' }} {{ user?.last_name || '' }}
          </h1>
        </div>
      </div>
      <button class="p-2 bg-white rounded-full shadow-sm active:scale-95 transition">
        <Settings class="w-5 h-5 text-gray-600" />
      </button>
    </header>

    <!-- BALANCE CARD -->
    <div class="px-4 mt-2">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <p class="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold">${{ balance.toLocaleString() }}</span>
          <span class="text-blue-200 text-sm">USD</span>
        </div>
        <div class="mt-4 flex gap-3">
          <button class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-lg text-sm font-medium transition">
            Deposit
          </button>
          <button class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-lg text-sm font-medium transition">
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

    <!-- BOTTOM NAV (OPTIONAL) -->
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center pb-safe">
       <!-- pb-safe нужен для iPhone (Home Indicator) -->
       <div class="flex flex-col items-center text-blue-600">
         <User class="w-6 h-6" />
         <span class="text-[10px] font-medium mt-1">Home</span>
       </div>
       <!-- Добавь другие табы если нужно -->
    </nav>

  </div>
</template>

<style>
/* CSS HACK для iOS: чтобы нижний отступ учитывал "челку" снизу */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
