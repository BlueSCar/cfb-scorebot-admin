import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const FieldGreen = {
  50: '#ECF7EF',
  100: '#D6EEDD',
  200: '#B0DDC0',
  300: '#82C99B',
  400: '#4FB272',
  500: '#1E913E',
  600: '#1A8035',
  700: '#177033',
  800: '#11592A',
  900: '#0D4521',
  950: '#062613',
};

const Surface = {
  0: '#FFFFFF',
  50: '#F7F9FC',
  100: '#ECEEF2',
  200: '#D0D0D4',
  300: '#B4B7BD',
  400: '#9AA0AA',
  500: '#70747C',
  600: '#52575F',
  700: '#3A4756',
  800: '#243140',
  900: '#182430',
  950: '#041329',
};

const ThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{green.500}',
          contrastColor: '#FFFFFF',
          hoverColor: '{green.700}',
          activeColor: '{green.800}',
        },
        highlight: {
          background: '{green.50}',
          focusBackground: '{green.100}',
          color: '{green.700}',
          focusColor: '{green.800}',
        },
        surface: {
          0: '{surface.0}',
          50: '{surface.50}',
          100: '{surface.100}',
          200: '{surface.200}',
          300: '{surface.300}',
          400: '{surface.400}',
          500: '{surface.500}',
          600: '{surface.600}',
          700: '{surface.700}',
          800: '{surface.800}',
          900: '{surface.900}',
          950: '{surface.950}',
        },
      },
      dark: {
        primary: {
          color: '{green.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{green.300}',
          activeColor: '{green.200}',
        },
        highlight: {
          background: 'rgba(79, 178, 114, 0.16)',
          focusBackground: 'rgba(79, 178, 114, 0.24)',
          color: '{green.200}',
          focusColor: '{green.100}',
        },
      },
    },
  },
  primitive: {
    green: FieldGreen,
    surface: Surface,
  },
});

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
  app: {
    head: {
      title: 'CFBD Score Bot',
      meta: [
        {
          name: 'description',
          content: 'Configure CFBD Score Bot broadcasts for Discord servers.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800' +
            '&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@primevue/nuxt-module', '@pinia/nuxt', '@sidebase/nuxt-auth'],
  css: [
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    '~/assets/css/brand-overrides.css',
  ],
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
        preset: ThemePreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    },
  },
});
