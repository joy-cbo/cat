export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'cat-manager-secret-key',
    resendApiKey: process.env.RESEND_API_KEY || '',
    public: {
      apiBase: '/api',
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
    imports: {
      dirs: ['server/database'],
    },
  },
})
