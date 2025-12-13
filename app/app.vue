<script setup lang="ts">
import { useUserStore } from '~/stores/user'

// Инициализируем юзера глобально при старте приложения
const userStore = useUserStore()

userStore.initUser()
</script>

<template>
  <div class="antialiased">
    <!-- NuxtPage — это место, куда Nuxt подставит index.vue или chat.vue -->
    <NuxtPage />
  </div>
</template>
