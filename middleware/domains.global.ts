export default defineNuxtRouteMiddleware((to, from) => {
    let host = useRequestURL().host.split(':')[0], parts = host.split('.'),
        host_ = host.replaceAll('.', '_')
    let dest = to.fullPath,
        dest_ = dest.toLowerCase()
    if (parts.length < 3)
        return navigateTo(useRequestURL().protocol + '//www.' + host + dest, { external: true })
    else if (dest_.startsWith('/_nuxt') || dest_.startsWith('/robots.txt'))
        return abortNavigation()
    else if (! dest_.startsWith('/' + host_)) {
        let p = '/' + host_ + (dest != '/' ? dest : '')
        return navigateTo(p)
    }
})
