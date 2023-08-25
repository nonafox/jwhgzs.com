<template>
    <div class="box box_sm hcenter">
        <span class="box_title" v-html="pageTitle"></span>
        <span class="box_graytitle" v-html="grayTitle"></span>
        <el-divider></el-divider>
        <el-form :model="formData" :rules="formVerify" label-position="top">
            <div v-if="pageType != 1">
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="formData.name">
                        <template #prefix>
                            <i class="fas fa-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" :show-password="true" v-model="formData.pass">
                        <template #prefix>
                            <i class="fas fa-key"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="pageType == 2">
                <el-form-item label="确认密码" prop="pass2">
                    <el-input type="password" :show-password="true" v-model="formData.pass2">
                        <template #prefix>
                            <i class="fas fa-key"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="pageType == 1 || pageType == 2">
                <el-form-item label="手机号" prop="phone">
                    <el-input type="number" style="margin-top: 5px margin-bottom: 5px" v-model="formData.phone">
                        <template #prefix>
                            <i class="fas fa-phone"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机验证码" prop="phoneVerify">
                    <el-input type="number" v-model="formData.phoneVerify">
                        <template #prefix>
                            <i class="fas fa-ticket-alt"></i>
                        </template>
                        <template #append>
                            <el-button text bg style="font-size: 80%" @click="sendPhoneVerify">
                                发送
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div class="box_tip">提示：忘记用户名/密码了可以用手机号登录哦！</div>
            <div style="margin-top: 60px">
                <el-button type="primary" :text="pageType != 0" size="large" round @click="doit(0, pageType == 0)">
                    {{ pageType == 0 ? '立即登录' : '账号密码登录' }}
                </el-button>
                <el-button type="primary" :text="pageType != 1" size="large" round @click="doit(1, pageType == 1)">
                    {{ pageType == 1 ? '立即登录' : '手机号登录' }}
                </el-button>
                <el-button type="primary" :text="pageType != 2" size="large" round @click="doit(2, pageType == 2)">
                    {{ pageType == 2 ? '立即注册' : '注册' }}
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://user', '用户中心'],
            ['', '登录注册']
        ],
        isLoginPage: true
    })
    
    // -- refs
    let pageType = ref(0),
        pageTitle = ref('登录'),
        grayTitle = ref('LOGIN'),
        isSentFirstPhoneVerify = ref(false),
        formVerify = ref({
            name: [
                {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                },
                {
                    min: config.value.USERINF_LENGTH['name_min'],
                    max: config.value.USERINF_LENGTH['name_max'],
                    message: '用户名长度必须在' + config.value.USERINF_LENGTH.name_min + '~' + config.value.USERINF_LENGTH.name_max + '之间哦~',
                    trigger: 'blur'
                }
            ],
            pass: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },
                {
                    min: config.value.USERINF_LENGTH['pass_min'],
                    max: config.value.USERINF_LENGTH['pass_max'],
                    message: '密码长度必须在' + config.value.USERINF_LENGTH.pass_min + '~' + config.value.USERINF_LENGTH.pass_max + '之间哦~',
                    trigger: 'blur'
                }
            ],
            pass2: [
                {
                    required: true,
                    message: '请重复输入密码',
                    trigger: 'blur'
                }
            ],
            phone: [
                {
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                }
            ],
            phoneVerify: [
                {
                    required: true,
                    message: '请输入手机验证码',
                    trigger: 'blur'
                }
            ]
        }),
        formData = ref({
            name: '',
            pass: '',
            pass2: '',
            phone: '',
            phoneVerify: ''
        })
    
    // -- app
    function sendPhoneVerify() {
        function go() {
            vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.phoneVerify, (vaptchaData) => {
                p({
                    name: '发送手机验证码',
                    url: u('local://api/user/phoneVerifySend'),
                    data: Object.assign({}, formData.value, vaptchaData),
                    on_ok() {
                        isSentFirstPhoneVerify.value = true
                    }
                })
            })
        }
        if (isSentFirstPhoneVerify.value) {
            confMsg({
                content: '你刚刚已经发送过一次手机验证码了哦，确定要再次发送嘛？每天你只能发送一定量的手机验证码哦~',
                type: 'warning',
                callback_ok: go
            })
        } else {
            go()
        }
    }
    function doit(type, isPost) {
        let jumpIt = () => {
            var defaultu = u('local://www')
            var ori = getUrlParam('from')
            j(ori ? ori : defaultu)
        }
        let next = function() {}
        switch (type) {
            case 0:
                if (! isPost) {
                    j(u('local://user/login'), '', true)
                    break
                }
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.login, (vaptchaData) => {
                    p({
                        name: '登录',
                        url: u('local://api/user/login'),
                        data: Object.assign({}, formData.value, vaptchaData),
                        jump: jumpIt,
                        on_ok(res) {
                            setCookie('userToken', res.data.userToken)
                            return '即将跳转~'
                        }
                    })
                })
                break
            case 1:
                if (! isPost) {
                    j(u('local://user/login') + '/phoneLogin', '', true)
                    break
                }
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.phoneLogin, (vaptchaData) => {
                    p({
                        name: '手机号登录',
                        url: u('local://api/user/phoneLogin'),
                        data: Object.assign({}, formData.value, vaptchaData),
                        jump: jumpIt,
                        on_ok(res) {
                            setCookie('userToken', res.data.userToken)
                            return '即将跳转~'
                        }
                    })
                })
                break
            case 2:
                if (! isPost) {
                    j(u('local://user/login') + '/signup', '', true)
                    break
                }
                if (formData.value.pass != formData.value.pass2) {
                    errMsg('两次输入的密码不一致哦~')
                    return
                }
                confMsg({
                    content: '真的要注册嘛？<br/><strong>如果是老朋友了，忘记了旧帐号的账号密码，请务必不要换手机号重新注册，可以用手机号登录再改密码、或者联系站长哦！</strong><br/>如果是新朋友那就愉快地点下确定吧~',
                    type: 'warning',
                    callback_ok: () => {
                        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.signup, (vaptchaData) => {
                            p({
                                name: '注册',
                                url: u('local://api/user/signup'),
                                data: Object.assign(formData.value, vaptchaData),
                                jump: () => j(u('local://user/login'), '', true),
                                on_ok(res) {
                                    return '即将跳转登录~'
                                }
                            })
                        })
                    }
                })
                break
            default:
                break
        }
    }
    
    switch (getRouteParam('page')) {
        case null:
        case '':
            pageType.value = 0
            pageTitle.value = '登录'
            grayTitle.value = 'LOGIN'
            break
        case 'phoneLogin':
            pageType.value = 1
            pageTitle.value = '登录'
            grayTitle.value = 'LOGIN'
            break
        case 'signup':
            pageType.value = 2
            pageTitle.value = '注册'
            grayTitle.value = 'SIGNUP'
            break
        default:
            break
    }
</script>