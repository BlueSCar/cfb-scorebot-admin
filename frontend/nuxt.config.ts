import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  $production: {
    runtimeConfig: {
      public: {
        apiBaseUrl: 'https://scorebotapi.collegefootballdata.com',
      },
    },
  },
  $development: {
    runtimeConfig: {
      public: {
        apiBaseUrl: 'http://localhost:3031',
      },
    },
  },
  runtimeConfig: {
    authSecret: '',
    discordClientId: '',
    discordClientSecret: '',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@primevue/nuxt-module', '@pinia/nuxt', '@sidebase/nuxt-auth'],
  css: ['primeflex/primeflex.css', 'primeicons/primeicons.css'],
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'discord',
      addDefaultCallbackUrl: true,
    },
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
