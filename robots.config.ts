import config from './config.ts'

const getHost = () => req.headers.host.split(':')[0]

export default [
    { UserAgent: '*' },
    { Disallow: '' },
    { Sitemap: (req) => `${config.api_base}/sitemap/` + getHost() }
]