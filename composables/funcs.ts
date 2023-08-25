if (! process.client) {
    let fetch
    let {
        Blob,
        blobFrom,
        blobFromSync,
        File,
        fileFrom,
        fileFromSync,
        FormData,
        Headers,
        Request,
        Response
    } = fetch = import('node-fetch')
}

/* try to use some awesome grammar ~~~ */
export const u = (dir) => {
    if (! dir) return null
    
    try {
        let tmp = dir.split('://')
        let res = useState('config').value.URLS_TABLE[tmp[0]]
        if (! res)
            return dir
        
        let arr = tmp[1].split('/')
        let result = res[0] ? res[0] : ''
        
        for (let k in arr) {
            let v = arr[k]
            if (res)
                res = res[v]
            if (typeof res == 'object' && res[0]) {
                result += res[0]
            } else if (res && typeof res != 'object') {
                result += res
            } else if (! res) {
                result += '/' + v
            }
        }
        
        return result
    } catch (ex) {
        return null
    }
}
globalThis.u = u
export const parseUrl = (url) => {
    if (typeof url != 'string') return null
    
    let type = 'out', flag, rr
    /* FU***********K!!! does Chrome crazy??? i console.log(urlp) after this,
       when i carefully look at the console, the two echos (one is after this, one is before return)
       are not completely the same: when you unfold the output object (to see the detail), they are 'the same'
       (thats the 'question' i found before, the first one contain props that sholdnt appear in its context
       like 'type' 'flag' etc.) but when you just look at the folded, the props in the two output objects arent the same:
       the first hasnt the strange props, the second has. that is the normal react !!
       IS THE CHROME INFIGHTING ???
       i spent many hours to make sure it. i finally found it was CHROMEs problem (or maybe feature ?) !!
       when you console.log(urlp.type, urlp.flag, urlp.route, ...) itll be all undefined !!
       ill call GOOGLE SON OF B**CH for wasting my 3 hours just for a unimportant 'error'
       */
    const client = process.client
    // URL()'s param #2: baseUrl
    let urlp = new URL(url, client ? document.location.href : 'https://localhost/'), urlp2, fullPath
    if (client && urlp.origin == document.location.origin) {
        let router = useRouter(),
            route = useRoute()
        type = 'local'
        fullPath = urlp.pathname + urlp.search + urlp.hash
        urlp2 = router.resolve(fullPath)
        if (! urlp2 || ! urlp2.name) {
            flag = '404'
        } else if (urlp2.name == route.name) {
            flag = 'refresh'
            if (JSON.stringify(urlp2.query) == JSON.stringify(route.query) && urlp2.hash != route.hash)
                flag = 'hash'
        }
    }
    
    urlp.type = type
    urlp.flag = flag
    urlp.route = urlp2
    urlp.fullPath = fullPath
    return urlp
}
export const j = (url = null, target = '', retainUrlParams = false) => {
    if (! process.client) return
    
    const route = useRoute(),
          router = useRouter()
    if (! url) url = route.fullPath
    
    let urlp
    if (retainUrlParams) {
        let s = route.fullPath.indexOf('?')
        let query = route.fullPath.substring(s)
        if (url.indexOf('?') >= 0)
            url += '&' + query
        else
            url += '?' + query
    }
    let { type: jumpType, flag, route: dest } = urlp = parseUrl(url)
    
    if (jumpType == 'local' && flag != 'hash' && target != '_blank') {
        navigateTo(dest.fullPath)
    } else if (flag == 'hash') {
        document.location.hash = ''
        document.location.hash = urlp.hash
    } else if (target == '_blank') {
        window.open(url)
    } else {
        document.location.href = url
    }
}
globalThis.j = j
globalThis.quillJump = (url) => {
    let prefix = 'javascript:'
    if (url.startsWith(prefix))
        eval(url.substring(prefix.length))
    else
        j(u(url), '_blank')
}
export const j_hash = async () => {
    if (! process.client) return
    
    const route = useRoute()
    if (route.hash) {
        document.location.hash = ''
        document.location.hash = route.hash
    }
}
export const p = (opts) => {
    const postErrLock = useState('postErrLock', () => false)
    
    return new Promise(async (resolve) => {
        if (postErrLock.value) {
            resolve()
            return
        }
        
        // values of the prop 'type': 
        // - 'loop' (will alert when get error only),
        // - 'money' (alert when process and error. take the name because money is not always necessary !)
        let {
            url, name, data = {}, file = null, type = '',
            out = false, on_ok = () => {}, on_err = () => {},
            jump = () => {}, jump_err = () => {}
        } = opts
        let client = process.client, lmsgID
        if (client && type != 'loop') {
            lmsgID = loadingMsg(
                `
                    <strong>${name}</strong>
                    <span>请求中……</span>
                `,
                0
            )
        }
        // F**KING CONGUATULATION !!! 4 days !!! just because this !!! this was in the if-block on this line
        // i thought it was because get/setCookie() and i rewrite it immediatly (at the beginning, get/setCookie() actually had a ploblem)
        // i just wanted to solve the ploblem that userToken cookie cant pass to the post-body
        // i fixed get/setCookie(), but there is some strange detail which still make the cookie ploblem
        // after i fully solved it, the pass cookie (to the post-body) ploblem was still existed !!
        // then i carefully look up here, and found .................. i have nothing to say now......
        if (client && getCookie('userToken'))
            data.userToken = getCookie('userToken')
        
        let ok = (resp) => {
            // must add brackets here, or itll run like this: `on_ok ? on_ok(resp) : (null || '\n')`
            let tip_ok = (on_ok ? on_ok(resp) : null) || '\n'
            if (type != 'loop' && type != 'money') {
                succMsg(
                    `
                        <strong>${name}</strong>
                        <span>成功！</span>
                        <div>${tip_ok}</div>
                    `,
                    () => jump && jump()
                )
            }
            jump && setTimeout(jump, 3000)
            closeLoadingMsg(lmsgID)
            
            resolve()
        }
        let err = (msg) => {
            if (client)
                postErrLock.value = true
            let tip_err = on_err(msg) || '\n'
            errMsg(
                `
                    <span>${name}处理失败：</span>
                    <br/>
                    <strong>${msg}</strong>
                    <br/>
                    <span>${tip_err}</span>
                `,
                () => {
                    postErrLock.value = false
                    jump_err && jump_err()
                }
            )
            jump_err && setTimeout(jump_err, 3000)
            closeLoadingMsg(lmsgID)
            
            resolve()
        }
        
        let fdata = new FormData()
        fdata.append('json', JSON.stringify(data))
        if (file)
            fdata.append('file', file)
        
        // dont use 'key' props here !!!!! i blocked here for 3 hours again just because i provide the 'key' prop
        // (i thought 'initialCache' did not work before, maybe my brain BOOM !)
        
        // i dont know why, but it seems that adding setTimeout() is the unique method to solve the strange problem
        // the problem: `await useFetch()` will run like `useFetch()` when it first post !!
        // itll trigger when i set 'key' prop, but when i remove the prop, it still sometimes trigger
        // maybe Nuxt's bug ? i think it's SSR-to-UI's ploblem
        
        // finally, use $fetch() (ohmyfetch, nuxt uses and auto import it) instead of useFetch(), no ploblem at all !!!!
        
        // fffffffffinally, i choose server-client-separated mode (i need to upload files and showing progress !!!!!!)
        // then i choose node-fetch instead of ohmyfetch to use FromData friendly
        
        // ##### IMPORTANT !!! see: https://github.com/nuxt/framework/issues/6475
        // nuxt instance cant be used after async actions, to avoid sharing states
        // so do use-State/Route/xxx before async actions, make them `let xxx = useXXX()` and use `xxx.value` after it
        // blocked for 2 days
        try {
            if (client) {
                let xhr = new XMLHttpRequest()
                // if we get 0 / 0, it's OK. because 0 / 0 = NaN ≈ 0
                xhr.upload.onprogress = (evt) => 
                    editLoadingMsg_percent(lmsgID, Math.round(evt.loaded / evt.total * 100))
                xhr.onload = () => {
                    try {
                        let res = JSON.parse(xhr.responseText)
                        if (out || res.status)
                            ok(res)
                        else
                            err(res.msg)
                    } catch (ex) {
                        err(ex)
                    }
                }
                xhr.open('POST', url)
                xhr.send(fdata)
            } else {
                let res = await useFetch(url, {
                    method: 'POST',
                    body: fdata
                })
                res = res.data.value
                
                if (out || res.status)
                    ok(res)
                else
                    err(res.msg)
            }
        } catch (ex) {
            err(ex)
        }
    })
}
export const runThread = async (func) => {
    let interval = useState('config').value.JSTHREAD_INTERVAL || 3000
    let ourl = useRoute().fullPath
    let loop = () => {
        setTimeout(async () => {
            if (process.client && ourl == useRoute().fullPath) {
                await func()
                loop()
            }
        }, interval)
    }
    await func()
    loop()
}
export const getCookie = (name) => {
    return useCookie(name, { domain: useState('config').value.JSCOOKIE_MAINDOMAIN, path: '/' }).value
}
export const setCookie = (name, value) => {
    useCookie(name, { domain: useState('config').value.JSCOOKIE_MAINDOMAIN, path: '/' }).value = value
}
export const random = (a, b) => {
    // 代码来源：https://www.runoob.com/w3cnote/js-random.html
    let arguments_length = (a ? 1 : 0) + (b ? 1 : 0)
    switch (arguments_length) {
        case 0:
            a = 100000000
            // 不break则会跳到下一个case。正好用到！
        case 1:
            return parseInt(Math.random() * a + 1, 10)
        case 2:
            return parseInt(Math.random() * (b - a + 1) + a, 10)
    } 
}
export const makeAvatarUrl = (udata) => {
    return udata ? (u('static://user/avatar') + '/' + udata.id + '.jpg?v=' + udata.avatarVersion) : null
}
export const getUrlParam = (name, _url) => {
    let url = _url || useRoute().fullPath || document.location.href
    let urlp = parseUrl(url)
    
    return decodeURIComponent((urlp.searchParams.get(name)) || '')
}
export const getRouteParam = (name) => {
    return useRoute().params[name]
}
export const copyIt = (data) => {
    if (! process.client) return
    
    // 复制参考：https://www.jianshu.com/p/d6d25bd73e2f
    let aux = document.createElement('input')
    let content = data
    aux.setAttribute('value', content)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
}
globalThis.copyIt = copyIt
export const copy = (text) => {
    if (! process.client) return
    
    copyIt(text)
    succMsg('复制成功！')
}
globalThis.copy = copy
export const sizeDesc = (size) => {
    if (typeof size != 'number') {
        size = 0
    }
    let sizeTable = [
        [0, 'B'],
        [1024, 'KB'],
        [1024 * 1024, 'MB'],
        [1024 * 1024 * 1024, 'GB'],
        [1024 * 1024 * 1024 * 1024, 'TB'],
        [1024 * 1024 * 1024 * 1024 * 1024, 'PB'],
        [1024 * 1024 * 1024 * 1024 * 1024 * 1024, 'EB']
    ]
    for (let k in sizeTable) {
        let v1 = sizeTable[k][0]
        let pv1, pv2
        if (sizeTable[k - 1]) {
            pv1 = sizeTable[k - 1][0]
            pv2 = sizeTable[k - 1][1]
        }
        if (size < v1) {
            return '' + (size / (pv1 ? pv1 : 1)).toFixed(2) + ' ' + pv2
        }
    }
    let lv1 = sizeTable[sizeTable.length - 1][0]
    let lv2 = sizeTable[sizeTable.length - 1][1]
    return '' + (size / lv1).toFixed(2) + ' ' + lv2
}
export const fill0 = (num, dig, zero) => {
    let _num = '' + num, _zero = (zero ? zero : '0')
    let result = _num
    for (let i = 0; i < (dig ? dig : 2) - _num.length; i ++) {
        result = _zero + result
    }
    return result
}
export const getTimeDesc = (time, withoutS = true) => {
    if (! parseInt(time)) {
        return ''
    }
    let date = new Date(parseInt(time))
    let dateText, h, i, s
    dateText = getDateDesc(time)
    h = fill0(date.getHours())
    i = fill0(date.getMinutes())
    s = fill0(date.getSeconds())
    if (! withoutS)
        return dateText + ' ' + h + ':' + i + ':' + s
    else
        return dateText + ' ' + h + ':' + i
}
export const getDateDesc = (time) => {
    if (! parseInt(time)) {
        return ''
    }
    let date = new Date(parseInt(time))
    let y, m, d, dateText
    y = date.getFullYear()
    m = fill0(date.getMonth() + 1)
    d = fill0(date.getDate())
    dateText = y + '/' + m + '/' + d
    let cdate = new Date()
    let cy, cm, cd
    cy = cdate.getFullYear()
    cm = fill0(cdate.getMonth() + 1)
    cd = fill0(cdate.getDate())
    if (y == cy && m == cm) {
        if (d == cd)
            return '今天'
        else if (d == cd - 1)
            return '昨天'
        else if (d == cd + 1)
            return '明天'
    }
    return dateText
}
export const inArray = (item, arr) => {
    return arr ? arr.indexOf(item) > -1 : false
}
export const isWechatOrQQ = () => {
    if (! process.client) return
    
    /* 判断是否微信、QQ内置浏览器。代码来源：https://www.cnblogs.com/love314159/p/10790533.html */
    let ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger')
        return 'wechat'
    else if (ua.match(/QQ/i) == 'qq')
        return 'qq'
    else
        return false
}
export const isNum = (i) => {
    return i !== null && i !== undefined && Number(i) + 1 && i !== ''
}
export const infoMsg = (content, callback) => {
    if (! process.client) return
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: true,
        canCancel: false,
        scene: 'info',
        title: '提示',
        content: content,
        callback_ok: callback,
        callback_cancel: callback
    }) - 1
}
export const succMsg = (content, callback) => {
    if (! process.client) return
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: true,
        canCancel: false,
        scene: 'success',
        title: '成功',
        content: content,
        callback_ok: callback,
        callback_cancel: callback
    }) - 1
}
export const warnMsg = (content, callback) => {
    if (! process.client) return
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: true,
        canCancel: false,
        scene: 'warning',
        title: '警告',
        content: content,
        callback_ok: callback,
        callback_cancel: callback
    }) - 1
}
export const errMsg = (content, callback) => {
    if (! process.client) return
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: true,
        canCancel: false,
        scene: 'danger',
        title: '失败',
        content: content,
        callback_ok: callback,
        callback_cancel: callback
    }) - 1
}
export const confMsg = (json) => {
    if (! process.client) return
    // { content, type, callback_ok, callback_cancel, canClose = true }
    if (! json.canClose && json.canClose !== false) json.canClose = true
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: json.canClose,
        canCancel: json.canClose,
        scene: json.type,
        title: '确认',
        content: json.content,
        callback_ok: json.callback_ok,
        callback_cancel: json.callback_cancel
    }) - 1
}
export const inputMsg = (json) => {
    if (! process.client) return
    // { content, inputType, callback_ok, callback_cancel, canClose = true, defaultValue = null, inputOptions = null }
    if (! json.canClose && json.canClose !== false) json.canClose = true
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: json.canClose,
        canCancel: json.canClose,
        scene: 'input',
        title: '输入',
        content: json.content,
        inputType: json.inputType,
        value: json.defaultValue,
        options: json.inputOptions,
        callback_ok: json.callback_ok,
        callback_cancel: json.callback_cancel
    }) - 1
}
export const loadingMsg = (content, defaultPercent = 0) => {
    if (! process.client) return
    return useState('dialogs').value.push({
        status: true,
        _status: true,
        canClose: false,
        canCancel: false,
        hideOK: true,
        scene: 'loading',
        title: '加载中',
        content: content,
        inputType: 'loading',
        value: defaultPercent
    }) - 1
}
export const closeMsg = (id, type) => {
    if (! process.client) return
    let dialogs = useState('dialogs').value
    if (type == 0) {
        if (dialogs[id].callback_cancel) {
            dialogs[id].callback_cancel(dialogs[id].value)
        }
    } else if (type == 1) {
        if (dialogs[id].callback_ok) {
            dialogs[id].callback_ok(dialogs[id].value)
        }
    }
    dialogs[id].status = false
}
export const closeLoadingMsg = (id) => {
    if (! process.client) return
    try { useState('dialogs').value[id].status = false } catch (ex) {}
}
export const editLoadingMsg_title = (id, title) => {
    if (! process.client) return
    try { useState('dialogs').value[id].title = title } catch (ex) {}
}
export const editLoadingMsg_percent = (id, percent) => {
    if (! process.client) return
    try { useState('dialogs').value[id].value = Number(percent.toFixed(0)) } catch (ex) {}
}
export const selectFile = (callback) => {
    if (! process.client) return
    
    let input = document.getElementById('fileUploader')
    input.click()
    input.onchange = () => {
        let data = input.files[0]
        input.onchange = () => {}
        input.value = ''
        let sizeLimit = useState('config').value.UPLOAD_SIZELIMIT
        if (data.size > sizeLimit) {
            errMsg('你选择的文件太大了哦~（大小限制：' + sizeDesc(sizeLimit) + '）')
            return
        }
        if (callback) callback(data)
    }
}
export const vaptchaGo = (scene, callback_ok, callback_close, callback_loaded) => {
    if (! process.client) return
    if (! useState('config').value.VAPTCHA_CONFIG.status) {
        callback_ok({ vaptchaData: {} })
        return
    }
    
    let loadingId = loadingMsg('验证码加载中……', -1)
    let vaptchaObj
    vaptcha({
        vid: useState('config').value.VAPTCHA_CONFIG.vid,
        mode: 'invisible',
        scene: scene,
        area: 'auto'
    }).then(function(_vaptchaObj) {
        vaptchaObj = _vaptchaObj
        vaptchaObj.listen('pass', function() {
            let serverToken = vaptchaObj.getServerToken()
            if (callback_ok) {
                callback_ok({
                    vaptchaData: {
                        server: serverToken.server,
                        token: serverToken.token,
                        scene: scene
                    }
                })
            }
            closeLoadingMsg(loadingId)
        })
        vaptchaObj.listen('close', function() {
            if (callback_close)
                callback_close()
            closeLoadingMsg(loadingId)
        })
        vaptchaObj.validate()
        if (callback_loaded)
            callback_loaded()
    })
}
export const jumpReload = () => {
    if (! process.client) return
    
    j(useRoute().fullPath)
}
export const jumpLogin = () => {
    if (! process.client) return
    
    j(u('local://user/login') + '?from=' + encodeURIComponent(document.location.href))
}
export const logout = () => {
    confMsg({
        content: '确定要退出登录咩？',
        type: 'warning',
        callback_ok() {
            setCookie('userToken', '')
            jumpLogin()
        }
    })
}
export const isAdmin = () => {
    let udata = useState('udata')
    if (udata.value)
        return inArray(parseInt(udata.value.id), udata.value.adminUids)
    else
        return false
}
export const toCDB = (str) => {
    // 到半角
    // 来源：https://www.jb51.net/article/117728.htm
    let tmp = ''
    for (let i = 0; i < str.length; i ++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375)
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        else
            tmp += String.fromCharCode(str.charCodeAt(i))
    }
    return tmp
}
export const toDBC = (str) => {
    // 到全角
    // 来源：https://www.jb51.net/article/117728.htm
    let tmp = ''
    for (let i = 0; i < str.length; i ++) {
        if (str.charCodeAt(i) == 32)
            tmp = tmp + String.fromCharCode(12288)
        if (str.charCodeAt(i) < 127)
            tmp = tmp + String.fromCharCode(str.charCodeAt(i) + 65248)
    }
    return tmp
}
export const arrayCompare = (a1, a2) => {
    return JSON.stringify(a1) == JSON.stringify(a2)
}
export const formatDialogInput = (type, content) => {
    switch (type) {
        case 'text':
        case 'textarea':
        case 'password':
        case 'select':
            return content
        case 'number':
        case 'date':
        case 'datetime':
            return parseFloat(content)
        default:
            return content
    }
}
export const getDialogInputVerb = (type) => {
    switch (type) {
        case 'text':
        case 'textarea':
        case 'password':
        case 'number':
            return '输入'
        case 'select':
        case 'date':
        case 'datetime':
            return '选择'
        default:
            return '输入'
    }
}
export const torture = (json) => {
    let { isEdit, oldData, list, next } = json
    let newData = {}
    let doAdd = (k = 0) => {
        let v = list[k]
        if (! v) {
            next(newData)
            return
        }
        inputMsg(Object.assign({
            content: '请' + getDialogInputVerb(v.type) + v.name + '：' + (v.note || ''),
            inputType: v.type,
            callback_ok(val) {
                newData[v.vname] = formatDialogInput(v.type, val)
                k ++
                doAdd(k)
            }
        }, v.appendConf || {}))
    }
    let doEdit = (k = 0) => {
        let v = list[k]
        if (! v) {
            let different = false
            for (let kk in list) {
                let vv = list[kk]
                if (oldData[vv.vname] != newData[vv.vname]) {
                    different = true
                    break
                }
            }
            if (! different) {
                infoMsg('什么都没有变哦~')
            }
            else {
                next(newData)
            }
            return
        }
        inputMsg(Object.assign({
            content: '请' + getDialogInputVerb(v.type) + v.name + '：' + (v.note || ''),
            inputType: v.type,
            defaultValue: formatDialogInput(v.type, oldData[v.vname]),
            callback_ok(val) {
                newData[v.vname] = formatDialogInput(v.type, val)
                k ++
                doEdit(k)
            }
        }, v.appendConf || {}))
    }
    if (isEdit)
        doEdit()
    else
        doAdd()
}