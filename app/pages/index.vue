<script setup lang="ts">
import { Wallet, History, MessageSquare, Zap, Settings, User as UserIcon } from 'lucide-vue-next'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { userInitials, fullName } = storeToRefs(userStore)

const balance = 1250.50
const menuItems = [
  // UPDATE: label 'AI Chat' is handled specially in template now via Link
  { label: 'Wallet', icon: Wallet, color: 'bg-purple-500' },
  { label: 'History', icon: History, color: 'bg-green-500' },
  { label: 'Fast Action', icon: Zap, color: 'bg-yellow-500' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
    <!-- HEADER -->
    <header class="p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm text-lg">
           {{ userInitials }}
        </div>
        <div>
          <p class="text-xs text-gray-500 font-medium">Welcome back,</p>
          <h1 class="font-bold text-xl leading-tight text-gray-800">
            {{ fullName }}
          </h1>
        </div>
      </div>
      <NuxtLink to="/settings" class="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-transform">
        <Settings class="w-5 h-5 text-gray-500" />
      </NuxtLink>
    </header>

    <!-- BALANCE -->
    <div class="px-5 mt-1">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
        <p class="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <span class="text-4xl font-bold tracking-tight relative z-10">${{ balance.toLocaleString() }}</span>
      </div>
    </div>

    <!-- ACTIONS GRID -->
    <div class="px-5 mt-8">
      <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4">

        <!-- LINK TO CHAT (Specially handled) -->
        <NuxtLink to="/chat" class="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
          <div class="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white">
            <MessageSquare class="w-6 h-6" />
          </div>
          <span class="font-medium text-sm text-gray-600">AI Chat</span>
        </NuxtLink>

        <!-- Other Items -->
        <button v-for="item in menuItems" :key="item.label" class="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-col items-center justify-center gap-3">
          <div :class="[item.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white']">
            <component :is="item.icon" class="w-6 h-6" />
          </div>
          <span class="font-medium text-sm text-gray-600">{{ item.label }}</span>
        </button>

      </div>
    </div>

    <!-- BOTTOM NAV -->
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

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
