import config from './config'

export default defineNuxtConfig({
    nitro: {
        preset: 'node-server'
    },
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        ['@nuxtjs/robots', { configPath: './robots.config' }]
    ],
    i18n: {
        vueI18n: './i18n.config'
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
        'quill-jwhgzs-edited/dist/quill.snow.css',
        '/public/style.css',
        '/public/quill.css'
    ]
})