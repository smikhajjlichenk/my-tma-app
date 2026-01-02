export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false, // SPA Mode
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // Явно подключаем типы
        types: ['@types/dom-speech-recognition']
      }
    }
  },

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      title: 'Andrew TMA',
      script: [
        {
          // Rescue Script: Сохраняет данные Telegram перед тем, как Nuxt загрузится
          innerHTML: `
            (function() {
              try {
                var key = 'tma_init_data_backup';
                var hash = window.location.hash;

                if (hash && hash.includes('tgWebAppData')) {
                  sessionStorage.setItem(key, hash);
                  console.log('[Rescue Script] Data saved to sessionStorage:', key);
                }
              } catch(e) {
                console.error('[Rescue Script] Error:', e);
              }
            })();
          `,
          type: 'text/javascript',
          // Ставим в head, чтобы сработало максимально рано
          tagPosition: 'head'
        }
      ]
    }
  },

  runtimeConfig: {
    // Private keys (доступны только на сервере)
    groqApiKey: import.meta.env.NUXT_GROQ_API_KEY,

    // Public keys (доступны и на клиенте, если нужно)
    public: {}
  }
})
