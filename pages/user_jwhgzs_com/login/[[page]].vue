<template>
    <div class="box box_sm hcenter">
        <span class="box_title" v-html="pageTitle"></span>
        <span class="box_graytitle" v-html="grayTitle"></span>
        <el-divider></el-divider>
        <el-form :model="formData" :rules="formVerify" label-position="top">
            <div v-if="pageType != 1">
                <el-form-item :label="$t('form_username')" prop="name">
                    <el-input type="text" v-model="formData.name">
                        <template #prefix>
                            <i class="fas fa-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('form_password')" prop="pass">
                    <el-input type="password" :show-password="true" v-model="formData.pass">
                        <template #prefix>
                            <i class="fas fa-key"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="pageType == 2">
                <el-form-item :label="$t('form_password_repeat')" prop="pass2">
                    <el-input type="password" :show-password="true" v-model="formData.pass2">
                        <template #prefix>
                            <i class="fas fa-key"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="pageType == 1 || pageType == 2">
                <el-form-item :label="$t('form_phone_number')" prop="phone">
                    <el-input type="number" style="margin-top: 5px; margin-bottom: 5px;" v-model="formData.phone">
                        <template #prefix>
                            <i class="fas fa-phone"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('form_phone_verify_code')" prop="phoneVerify">
                    <el-input type="number" v-model="formData.phoneVerify">
                        <template #prefix>
                            <i class="fas fa-ticket-alt"></i>
                        </template>
                        <template #append>
                            <el-button text bg style="font-size: 80%" @click="sendPhoneVerify">
                                {{ $t('send') }}
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <div class="box_tip">{{ $t('forget_password_tip') }}</div>
            <div style="margin-top: 60px">
                <el-button type="primary" :text="pageType != 0" size="large" round @click="doit(0, pageType == 0)">
                    {{ pageType == 0 ? $t('login_now') : $t('login_by_password') }}
                </el-button>
                <el-button type="primary" :text="pageType != 1" size="large" round @click="doit(1, pageType == 1)">
                    {{ pageType == 1 ? $t('login_now') : $t('login_by_phone_number') }}
                </el-button>
                <el-button type="primary" :text="pageType != 2" size="large" round @click="doit(2, pageType == 2)">
                    {{ pageType == 2 ? $t('register_now') : $t('register') }}
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
            ['local://user', 'page_title_ucenter'],
            ['', 'page_title_ucenter_login']
        ],
        isLoginPage: true
    })
    
    // -- refs
    let fromMainDomain = ! getUrlParam('out'),
        pageType = ref(0),
        pageTitle = ref('登录'),
        grayTitle = ref('LOGIN'),
        isSentFirstPhoneVerify = ref(false),
        formVerify = ref({
            name: [
                {
                    required: true,
                    message: $t('please_input') + ' ' + $t('_username'),
                    trigger: 'blur'
                },
                {
                    min: config.value.USERINF_LENGTH['name_min'],
                    max: config.value.USERINF_LENGTH['name_max'],
                    message: $t('length_of_username_must_be') + ' ' + config.value.USERINF_LENGTH.name_min + '~' + config.value.USERINF_LENGTH.name_max,
                    trigger: 'blur'
                }
            ],
            pass: [
                {
                    required: true,
                    message: $t('please_input') + ' ' + $t('_password'),
                    trigger: 'blur'
                },
                {
                    min: config.value.USERINF_LENGTH['pass_min'],
                    max: config.value.USERINF_LENGTH['pass_max'],
                    message: $t('length_of_password_must_be') + ' ' + config.value.USERINF_LENGTH.pass_min + '~' + config.value.USERINF_LENGTH.pass_max,
                    trigger: 'blur'
                }
            ],
            pass2: [
                {
                    required: true,
                    message: $t('please_input_repeat') + ' ' + $t('_password'),
                    trigger: 'blur'
                }
            ],
            phone: [
                {
                    required: true,
                    message: $t('please_input') + ' ' + $t('_phone_number'),
                    trigger: 'blur'
                }
            ],
            phoneVerify: [
                {
                    required: true,
                    message: $t('please_input') + ' ' + $t('_phone_verify_code'),
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
                    name: $t('api_send_phone_verify_code'),
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
                content: $t('question_confirm_to_send_phone_verify_code'),
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
            if (fromMainDomain) {
                j(ori ? ori : defaultu)
            }
            else {
                ori += '?userToken=' + getCookie('userToken')
                j(ori)
            }
        }
        switch (type) {
            case 0:
                if (! isPost) {
                    j(u('local://user/login'), '', true)
                    break
                }
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.login, (vaptchaData) => {
                    p({
                        name: $t('api_login'),
                        url: u('local://api/user/login'),
                        data: Object.assign({}, formData.value, vaptchaData),
                        jump: jumpIt,
                        on_ok(res) {
                            setCookie('userToken', res.data.userToken)
                            return $t('ready2jump_general')
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
                        name: $t('api_login_by_phone_number'),
                        url: u('local://api/user/phoneLogin'),
                        data: Object.assign({}, formData.value, vaptchaData),
                        jump: jumpIt,
                        on_ok(res) {
                            setCookie('userToken', res.data.userToken)
                            return $t('ready2jump_general')
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
                    errMsg($t('wrongly_repeat_tip'))
                    return
                }
                confMsg({
                    content: $t('register_tip'),
                    type: 'warning',
                    callback_ok: () => {
                        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.signup, (vaptchaData) => {
                            p({
                                name: $t('api_register'),
                                url: u('local://api/user/signup'),
                                data: Object.assign(formData.value, vaptchaData),
                                jump: () => j(u('local://user/login'), '', true),
                                on_ok(res) {
                                    return $t('ready2jump_login')
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
            grayTitle.value = 'REGISTER'
            break
        default:
            break
    }
</script>