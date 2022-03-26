export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'cv',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '64x64' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // { src: 'swiper/swiper-bundle.min.css' },
    { src: '~/assets/scss/ui.scss' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/scripts/init.ts', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@aceforth/nuxt-optimized-images'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/gtm'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  gtm: {
    id: 'GTM-XXX'
  },

  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: true,
    inlineImageLimit: 10 * 1024,
    mozjpeg: {
      quality: 80
    },
    webp: {
      quality: 85
    },
    avif: {
      quality: 40
    },
    svgo: {
      plugins: [
        { name: 'removeViewBox', active: false }
      ]
    }
  },

  generate: {
    fallback: '404.html',
    crawler: true,
    subFolders: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    standalone: true
  }
}
