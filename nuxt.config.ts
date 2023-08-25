// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // custom global components. origin: https://v3.nuxtjs.org/guide/directory-structure/components
    modules: [
        '@element-plus/nuxt'
    ],
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        public: {
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
