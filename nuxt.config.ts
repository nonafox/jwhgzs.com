const api_base = 'https://api.jwhgzs.com'

export default defineNuxtConfig({
    nitro: {
        preset: 'node-server'
    },
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        '@nuxtjs/robots'
    ],
    i18n: {
        vueI18n: './i18n.config.ts'
    },
    robots: {
        rules: {
            UserAgent: '*',
            Disallow: '',
            BlankLine: true,
            Sitemap: (req) => `${api_base}/sitemap/` + req.headers.host.replaceAll('.', '_')
        }
    },
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        'public': {
            configAPI: api_base
        }
    },
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'element-plus/dist/index.css',
        '/public/style.css',
        '/public/quill.css'
    ]
})
