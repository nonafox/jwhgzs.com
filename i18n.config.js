import i18n from './i18n'

const resolveI18n = () => {
    let arr = i18n.split('\n'), res = { cn: { ' ': '' }, en: { ' ': ' ' } }
    for (let v of arr) {
        v = v.replace(/^\s+/g, '')
        if (! v) continue
        let [, tag, cn, en] = /(.*?):\s(.*?)\s\|\s(.*)/.exec(v)
        res.cn[tag] = cn || tag
        res.en[tag] = en || tag
    }
    return res
}

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'cn',
    messages: resolveI18n()
}))