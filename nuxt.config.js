export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Nuxt Coloring',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  ssr: false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/style.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/checkView.js',
    '~/plugins/tooltip.js',
    '~/plugins/clipboard.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/postcss8',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'Fa',
        suffix: false,
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-vuex-localstorage',
    {
      localStorage: ['stored']
    }]
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    '@nuxtjs/google-fonts': {
      families: {
        'Anonymous+Pro': true,
      },
    },
  },
  googleFonts: {},
  fontawesome: {
    icons: {
      regular: ['faObjectGroup'],

      solid: [
        ...['Left', 'Right', 'Up', 'Down'].reduce((acc, direction) => {
          return [
            ...acc,
            ...['faAngle', 'faArrow'].map(
              (namespace) => `${namespace}${direction}`
            ),
          ];
        }, []),
        'faHouse',
        'faTrash',
        'faGripLines',
        'faBars',
        'faEllipsis',
        'faEllipsisVertical',
        'faCheck',
        'faPen',
        'faPenToSquare',
        'faFloppyDisk',
        'faClone',
        'faCopy',
        'faPlus',
        'faXmark',
        'faDroplet',
        'faList',
        'faGear',
        'faSliders',
        'faWrench',
        'faClipboard',
        'faClipboardCheck',
        'faArrowUpRightFromSquare',
        'faICursor',
        'faSwatchbook',
        'faLayerGroup',
        'faSquare',
        'faSquareCheck',
        'faMagnifyingGlass',
        'faGripVertical',
      ],
    },
  },
};
