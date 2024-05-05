import config from './config.ts'

const getHost = (host) => host.split(':')[0]

export default [
    { UserAgent: '*' },
    { Disallow: '' },
    { Sitemap: (req) => `${config.api_base}/sitemap/` + getHost(req.headers.host) }
]