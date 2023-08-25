<style scoped>
    .nav {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 99;
        opacity: 97%;
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
        background-color: #FFF;
        white-space: nowrap;
    }
    .mainnav {
        height: 54px;
        
        /* 设高基操居中（纵） */
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        padding-left: 10px;
    }
    .subnav {
        height: 35px;
        padding: 0 20px;
        line-height: 35px;
    }
    .logo_banner {
        /* 强制居中 45px+5px+5px=55px */
        padding-top: 5px;
        height: 45px;
        padding-bottom: 5px;
    }
    .nav_userinfo {
        position: absolute;
        top: 0;
        right: 15px;
        line-height: 55px;
        font-size: 80%;
    }
    .nav_userinfo_name {
        margin-left: 10px;
        color: gray;
    }
    .nav_breadcrumb {
        margin-left: 10px;
        font-size: 80%;
        line-height: inherit !important;
    }
    .nav_menu {
        position: fixed !important;
        top: 55px;
        right: 0;
        border-bottom: none !important;
    }
    .nav_a {
        text-decoration: none;
        line-height: 20px;
        text-align: center;
    }
    .nav_a_span {
        margin-left: 10px;
        font-size: 80%;
    }
    .block {
        height: calc(55px + 35px + 20px);
        width: 100%;
    }
    .tail {
        margin-top: 40px;
        left: 0;
        width: calc(100% - 20px * 2);
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
        padding: 20px;
        background-color: #EFF5FB;
        text-align: center;
        color: gray;
    }
    .tail {
        font-size: 80%;
    }
    .tail_div {
        margin-top: 10px;
    }
    .tail_link {
        margin-left: 15px;
    }
</style>

<template>
    <el-config-provider :locale="locale">
        <div id="loading" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: #409EFF; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="color: white; font-size: 200%;">加载中</div>
            <div style="color: white;">loading</div>
        </div>
        <div id="page" class="bkg" :style="{ display: loading ? 'none' : 'block', 'background-image': 'url(' + (u($route.meta.bgImg) || u('static://public/img/bkg')) + ')' }">
            <div id="header">
                <div id="nav" class="nav">
                    <div id="mainnav" class="mainnav">
                        <custom-a :href="u('local://www')">
                            <img :src="u('static://public/img/logo_banner')" alt="九尾狐logo" class="logo_banner"/>
                        </custom-a>
                    </div>
                    <div id="subnav" class="subnav">
                        <div v-if="udata" class="nav_userinfo">
                            <user-avatar :udata="udata"></user-avatar>
                            <span :class="{ nav_userinfo_name: true, authed_uname: (udata.userGroup || udata.userAuth) }">{{ udata.name }}</span>
                        </div>
                        <el-breadcrumb class="nav_breadcrumb">
                            <!-- 这里最后一项自动加的css是elementplus自己给的 -->
                            <el-breadcrumb-item v-for="v in $route.meta.titles">
                                <custom-a :href="u(v[0])">
                                    {{ v[1] }}
                                </custom-a>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                        <el-menu class="nav_menu" mode="horizontal" :ellipsis="false">
                            <template v-if="isMainDomain">
                                <el-menu-item v-if="! getCookie('userToken')" index="1">
                                    <el-button :disabled="$route.meta.isLoginPage" text @click="jumpLogin">
                                        <i class="fas fa-sign-in-alt"></i>
                                        <span class="nav_a_span">登录 / 注册</span>
                                    </el-button>
                                </el-menu-item>
                                <el-menu-item v-if="userToken" index="2">
                                    <el-button :disabled="$route.meta.isUcenterPage ? ucenterOwnerIsMe : false" text @click="j(u('local://user/ucenter'))">
                                        <i class="fas fa-user"></i>
                                        <span class="nav_a_span">我的</span>
                                    </el-button>
                                </el-menu-item>
                                <el-menu-item v-if="userToken" index="3">
                                    <el-button text @click="logout" href="javascript:;">
                                        <i class="fas fa-sign-out-alt"></i>
                                        <span class="nav_a_span">退出</span>
                                    </el-button>
                                </el-menu-item>
                            </template>
                            <template v-if="! isMainDomain">
                                <el-menu-item index="1">
                                    <el-button text @click="j(u('local://www'))">
                                        <i class="fas fa-undo"></i>
                                        <span class="nav_a_span">返回主站</span>
                                    </el-button>
                                </el-menu-item>
                            </template>
                        </el-menu>
                    </div>
                </div>
            </div>
            
            <!-- 占位block -->
            <div id="block" class="block"></div>
            
            <!-- 页面内容 -->
            <div id="content" style="padding: 7px;" :style="{ 'min-height': content_h + 'px' }">
                <NuxtPage/>
            </div>
            
            <!-- 页尾 -->
            <div v-show="tailShow" id="tail" class="tail">
                <!-- 当年的页尾已不再是页尾，当年的备案已不再回。也许一波三折，才算是真正的人生吧。
                    ——记2022年2月27日由于生活资金紧张问题，被迫注销备案，台山市九尾狐网络有限公司即将不复存在…… -->
                <!--
                    <div>
                        Copyright &copy; 2020-<?= date('Y') ?> jwhgzs.com 台山市九尾狐网络有限公司 版权所有
                    </div>
                    <div class="tail_div">
                        <el-link href="<?= u('beian://icp') ?>" target="_blank" type="primary">粤ICP备2021007196号</el-link>
                        &nbsp;
                        <el-link href="<?= u('beian://gong_an') ?>" target="_blank" type="primary">
                            <img alt="公安备案图标" class="imgAwesome" :src="u('static://public/img/beian_icon') ?>"/>
                            粤公网安备44078102440947号
                        </el-link>
                    </div>
                    <div class="tail_div">
                        联系我们：QQ群：725058854，邮箱：admin@jwhgzs.com
                    </div>
                -->
                <div>
                    Copyright &copy; {{ config.INF.year_from }}-{{ config.INF.year_to }} jwhgzs.com 谭镇洋 版权所有
                </div>
                <el-divider></el-divider>
                <div class="tail_div">
                    联系我们：QQ群：{{ config.CONTACT_INF.qq }}，邮箱：{{ config.CONTACT_INF.email }}
                </div>
                <div class="tail_div">
                    <el-link class="tail_link" :href="u('sponsors://canva')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_canva')" alt="Canva logo" class="logolink"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://bt')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_bt')" alt="宝塔 logo" class="logolink_bigger"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://tencent-cloud')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_tencentcloud')" alt="腾讯云 logo" class="logolink"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://dnspod')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_dnspod')" alt="Dnspod logo" class="logolink"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://rainyun')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_rainyun')" alt="雨云 logo" class="logolink"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://vaptcha')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_vaptcha')" alt="Vaptcha logo" class="logolink"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://ym163com')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_ym163com')" alt="ym.163.com logo" class="logolink_bigger"/>
                    </el-link>
                    <el-link class="tail_link" :href="u('sponsors://regery')" target="_blank" type="primary">
                        <img :src="u('static://public/img/sponsor_regery')" alt="Regery logo" class="logolink_bigger"/>
                    </el-link>
                </div>
            </div>
            
            <!-- 公共组件 -->
            <template v-for="(v, k) in dialogs">
                <el-dialog v-if="v._status" v-model="v.status" :close-on-click-modal="v.canClose" :close-on-press-escape="v.canClose" :show-close="v.canClose" @close="v.callback_cancel || function () {}" @closed="v._status = false" append-to-body>
                    <template #header>
                        <div style="font-size: 125%; font-weight: bold; color: gray;">
                            <i v-if="v.scene == 'success'" class="fas fa-check-circle" style="color: #67C23A"></i>
                            <i v-if="v.scene == 'warning'" class="fas fa-exclamation-triangle" style="color: #E6A23C"></i>
                            <i v-if="v.scene == 'info'" class="fas fa-info-circle" style="color: #909399"></i>
                            <i v-if="v.scene == 'danger'" class="fas fa-times-circle" style="color: #F56C6C"></i>
                            <i v-if="v.scene == 'input'" class="fas fa-italic" style="color: #909399"></i>
                            <i v-if="v.scene == 'loading'" class="fas fa-spinner rotate" style="color: #909399"></i>
                            <span v-html="v.title" style="margin-left: 15px"></span>
                        </div>
                    </template>
                    <template #footer>
                        <el-button v-if="v.canCancel" type="primary" @click="closeMsg(k, 0)" plain>取消</el-button>
                        <el-button v-if="! v.hideOK" type="primary" @click="closeMsg(k, 1)">确定</el-button>
                    </template>
                    
                    <div v-html="v.content" style="margin-bottom: 10px"></div>
                    <template v-if="v.inputType == 'text'">
                        <el-input v-model="v.value" type="text"></el-input>
                    </template>
                    <template v-if="v.inputType == 'textarea'">
                        <el-input v-model="v.value" type="textarea" :autosize="{ minRows: 3, maxRows: 16 }"></el-input>
                    </template>
                    <template v-if="v.inputType == 'number'">
                        <el-input v-model="v.value" type="number"></el-input>
                    </template>
                    <template v-if="v.inputType == 'password'">
                        <el-input v-model="v.value" type="password" show-password></el-input>
                    </template>
                    <template v-if="v.inputType == 'select'">
                        <el-select v-model="v.value">
                            <el-option v-for="v2 in v.options" :label="v2.label" :value="v2.value"></el-option>
                        </el-select>
                    </template>
                    <template v-if="v.inputType == 'date'">
                        <el-date-picker v-model="v.value" type="date" value-format="x"></el-date-picker>
                    </template>
                    <template v-if="v.inputType == 'datetime'">
                        <el-date-picker v-model="v.value" type="datetime" value-format="x"></el-date-picker>
                    </template>
                    <template v-if="v.inputType == 'loading'">
                        <el-progress :percentage="v.value >= 0 ? v.value : 100" :text-inside="true" :stroke-width="20" :indeterminate="v.value < 0" :show-text="v.value >= 0" :duration="1"></el-progress>
                    </template>
                </el-dialog>
            </template>
            <input v-show="false" id="fileUploader" type="file"/>
        </div>
    </el-config-provider>
</template>

<script>
    /* loading思路来源：https://segmentfault.com/a/1190000042078966 */
    if (process.client) {
        document.onreadystatechange = () => {
            if (document.readyState == 'complete') {
                setTimeout(() => {
                    document.getElementById('page').style.display = 'block'
                    document.getElementById('loading').style.display = 'none'
                }, 200)
            }
        }
    }
</script>

<script setup>
    /* learn to write English comments now !!! */
    import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
    
    // -- basics
    let _config = await useFetch(useRuntimeConfig().public.configAPI)
    let config = useState('config', () => _config.data)
    
    let route = useRoute(),
        router = useRouter()
    // this is a macro function, cant call functions in funcs.ts (nuxt instance is not defined)
    useHead({
        script: [
            {
                src: u('static://public/js/vaptcha'),
                body: true
            },
            {
                src: u('node_modules://quill/js'),
                body: true
            }
        ],
        titleTemplate: () => {
            let prefix = config.value.INF.title_prefix
            try {
                return prefix + route.meta.titles[0][1]
            } catch (ex) {
                return prefix + '？'
            }
        },
        meta: [
            {
                name: 'description',
                content: config.value.SEO_INF.desc
            },
            {
                name: 'keywords',
                content: config.value.SEO_INF.keys
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: u('static://public/img/logo_ico')
            },
            {
                rel: 'stylesheet',
                href: u('node_modules://quill/css')
            }
        ]
    })
    
    // -- refs
    // configure vars
    const locale = zhCn
    // whole-app-public vars
    let dialogs = useState('dialogs', () => []),
        udata = useState('udata', () => {}),
        ucenterOwnerIsMe = useState('ucenterOwnerIsMe', () => false),
        loading = ref(true)
    
    if (process.client)
        loading.value = false
    
    // vars which only used here
    let tailShow = ref(false),
        content_h = ref(0)
    
    // -- app
    let userToken = computed(() => {
        return getCookie('userToken')
    })
    function autoAdapt() {
        try {
            let window_w, window_h
            window_w = window.screen.availWidth
            window_h = window.screen.availHeight
            
            let content_el = document.getElementById('content'),
                header_h = document.getElementById('header').offsetHeight,
                tail_h = document.getElementById('tail').offsetHeight
            let content_h = window_h - header_h - tail_h
            content_h.value = 'min-height: ' + content_h.toFixed(0) + 'px'
        } catch (ex) { }
    }
    async function loopThread() {
        await (async () => {
            if (! getCookie('userToken')) return
            await p({
                name: '用户数据同步',
                url: u('local://api/user/data'),
                on_ok(res) {
                    udata.value = res.data.userData
                },
                jump_err: jumpLogin,
                on_err() {
                    setCookie('userToken', '')
                    return '即将跳转登录！'
                },
                type: 'loop'
            })
        })()
        
        if (process.client)
            setTimeout(loopThread, config.value.JSTHREAD_INTERVAL)
    }
    let isMainDomain = computed(() => {
        return ! route.meta.isntMainDomain
    })
    
    if (process.client) {
        // auto adaption
        window.onresize = autoAdapt
        autoAdapt()
        
        // login verify
        if (! getCookie('userToken') && route.meta.mustLogin) {
            setCookie('userToken', '')
            jumpLogin()
        }
        
        // init UI
        tailShow.value = true
        
        ; await loopThread()
    }
</script>