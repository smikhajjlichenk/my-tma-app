<script setup lang="ts">
import { Wallet, History, MessageSquare, Zap, Settings, User as UserIcon } from 'lucide-vue-next'

// Вся магия теперь тут 👇
const { user, isPremium } = useTelegram()

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
    <!-- ВРЕМЕННЫЙ ДЕБАГ ЮЗЕРА -->
    <div class="bg-yellow-100 p-2 text-xs font-mono break-all text-black border-b border-yellow-300">
      RAW USER: {{ user }}
    </div>

    <!-- HEADER -->
    <header class="p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Аватар -->
        <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm text-lg">
           {{ user?.firstName?.[0] || '?' }}
        </div>

        <!-- Инфо -->
        <div>
          <p class="text-xs text-gray-500 font-medium">Welcome back,</p>
          <div class="flex items-center gap-1">
            <h1 class="font-bold text-xl leading-tight text-gray-800">
              {{ user?.firstName || user?.first_name || 'Guest' }}
            </h1>
            <!-- Значок премиума -->
            <span v-if="isPremium" class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold shadow-sm">
              PRO
            </span>
          </div>
        </div>
      </div>

      <button class="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-transform">
        <Settings class="w-5 h-5 text-gray-500" />
      </button>
    </header>

    <!-- BALANCE CARD -->
    <div class="px-5 mt-1">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
        <!-- Анимированный фон (Tailwind arbitrary values) -->
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

        <p class="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <div class="relative z-10 flex items-end gap-1 mb-6">
          <span class="text-4xl font-bold tracking-tight">${{ balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
        </div>

        <div class="flex gap-3 relative z-10">
          <button class="flex-1 bg-white/20 hover:bg-white/25 active:bg-white/30 backdrop-blur-md py-3 rounded-xl text-sm font-semibold transition border border-white/10 shadow-lg shadow-black/5">
            Deposit
          </button>
          <button class="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-md py-3 rounded-xl text-sm font-semibold transition border border-white/5">
            Withdraw
          </button>
        </div>
      </div>
    </div>

    <!-- ACTION GRID -->
    <div class="px-5 mt-8">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition hover:shadow-md hover:border-blue-100 group"
        >
          <div :class="[item.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-gray-200 group-hover:scale-110 transition-transform duration-300']">
            <component :is="item.icon" class="w-6 h-6 stroke-[2]" />
          </div>
          <span class="font-medium text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- BOTTOM TAB BAR -->
    <nav class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-2 flex justify-around items-center pb-safe z-50">
       <button class="flex flex-col items-center text-blue-600 p-2 transition active:scale-90">
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
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
