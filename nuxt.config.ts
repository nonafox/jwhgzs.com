import config from './config.ts'

export default defineNuxtConfig({
    nitro: {
        preset: 'node-server'
    },
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        ['@nuxtjs/robots', { configPath: './robots.config.ts' }]
    ],
    i18n: {
        vueI18n: './i18n.config.ts'
    },
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        'public': {
            configAPI: config.api_base
        }
    },
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'element-plus/dist/index.css',
        '/public/style.css',
        '/public/quill.css'
    ]
})
