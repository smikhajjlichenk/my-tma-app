// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              try {
                var hash = window.location.hash;
                var key = 'tma_init_data_backup';

                // 1. Сохраняем хеш, если он есть
                if (hash.startsWith('#tgWebAppData') || hash.includes('tgWebAppData')) {
                  sessionStorage.setItem(key, hash);
                  console.log('[TMA Rescue] Hash saved:', hash);
                }
                // 2. Восстанавливаем, если пропал
                else {
                  var backup = sessionStorage.getItem(key);
                  if (backup) {
                    window.location.hash = backup;
                    console.log('[TMA Rescue] Hash restored');
                  }
                }
              } catch(e) { console.error('[TMA Rescue] Error:', e); }
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'bodyOpen'
        }
      ]
    }
  }
})
