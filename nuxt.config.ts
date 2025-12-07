export default defineNuxtConfig({
  // 1. Отключаем SSR (TMA это SPA приложение)
  ssr: false,

  devtools: { enabled: true },

  // 2. Стили и модули
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/scss/main.scss'],

  // 3. СКРИПТ-СПАСАТЕЛЬ (Самое важное)
  app: {
    head: {
      script: [
        {
          // Этот JS выполнится раньше загрузки Nuxt
          innerHTML: `
            (function() {
              try {
                var hash = window.location.hash;
                var key = 'tma_init_data_backup';

                // Если видим данные Телеграма — сохраняем их
                if (hash.startsWith('#tgWebAppData') || hash.includes('tgWebAppData')) {
                  sessionStorage.setItem(key, hash);
                  console.log('[TMA Rescue] Hash saved to storage');
                }
                // Если хеша нет — пытаемся восстановить (на случай редиректа)
                else {
                  var backup = sessionStorage.getItem(key);
                  if (backup) {
                    window.location.hash = backup;
                    console.log('[TMA Rescue] Hash restored from storage');
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
