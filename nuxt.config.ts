export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      title: 'Andrew TMA',
      script: [
        {
          // "Rescue Script" — сохраняет хеш до загрузки фреймворка
          innerHTML: `
            (function() {
              try {
                const k='tma_backup', h=window.location.hash;
                if(h.includes('tgWebAppData')) sessionStorage.setItem(k, h);
                else { const b=sessionStorage.getItem(k); if(b) window.location.hash=b; }
              } catch(e) {}
            })();
          `,
          tagPosition: 'bodyOpen'
        }
      ]
    }
  }
})