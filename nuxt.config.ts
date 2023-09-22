// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // custom global components. origin: https://v3.nuxtjs.org/guide/directory-structure/components
    nitro: {
        preset: 'node-server'
    },
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/i18n',
        '@vueuse/nuxt'
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
            configAPI: 'https://api.jwhgzs.com'
        }
    },
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'element-plus/dist/index.css',
        '/public/style.css',
        '/public/quill.css'
    ]
})
