<style scoped>
    .avatar {
        margin-right: 10px;
    }
    .name {
        margin-left: 25px;
        font-size: 200%;
        font-weight: bold;
        color: gray;
    }
    .main1 {
        margin-right: 25px;
    }
    .ske_avatar {
        width: 120px;
        height: 120px;
        margin-right: 30px;
    }
    .ske_info {
        margin-top: 20px;
        height: 200px;
    }
    .changeAvatar {
        position: absolute;
        width: 120px;
        
        text-align: center;
    }
    .changeAvatar_btn {
        margin-top: -20px;
    }
    .col1 {
        margin-right: calc(100% / 24);
        margin-bottom: 20px;
    }
    .selfintroduce {
        padding: 15px;
        border-radius: 5px;
        background-color: #f5f7fa;
        margin-bottom: 10px;
        
        white-space: pre-wrap;
    }
    .userTag {
        font-size: 120%;
        font-weight: bold;
    }
</style>

<template>
    <el-row>
        <el-col class="col1" :md="11">
            <div class="box">
                <el-skeleton :loading="! ucdata" :rows="4" animated>
                    <template #template>
                        <el-skeleton-item variant="circle" class="ske_avatar"></el-skeleton-item>
                        <el-skeleton-item variant="h3" class="ske_info"></el-skeleton-item>
                    </template>
                    <template #default>
                        <el-row class="main1">
                            <el-col :span="-1" style="margin-bottom: 30px">
                                <user-avatar :udata="ucdata" :size="120"></user-avatar>
                                <div v-if="ucenterOwnerIsMe" class="changeAvatar">
                                    <el-button size="large" class="changeAvatar_btn" @click="changeAvatar" circle>
                                        <i class="fas fa-redo"></i>
                                    </el-button>
                                </div>
                            </el-col>
                            <el-col :span="-1" class="vcenter" style="margin-bottom: 30px">
                                <div :class="{ name: true, authed_uname: (ucdata.userGroup || ucdata.userAuth) }">{{ ucdata.name }}</div>
                            </el-col>
                        </el-row>
                        <div v-if="ucdata.isMe || ucdata.selfIntroduce" class="selfintroduce">
                            <span v-if="ucdata.selfIntroduce">{{ ucdata.selfIntroduce }}</span>
                            <span v-if="! ucdata.selfIntroduce" style="color: gray">还没有个性签名哦~</span>
                            <el-button v-if="ucenterOwnerIsMe" @click="setUdata('selfIntroduce', '个性签名', 'textarea', ucdata.selfIntroduce)" style="margin-left: 10px" circle>
                                <i class="fas fa-edit"></i>
                            </el-button>
                        </div>
                        <el-divider></el-divider>
                        <div>
                            <template v-for="(v, k) in ucdata.userTags[0]">
                                <el-tag size="large" type="success" class="btns2 userTag">
                                    {{ v }}
                                </el-tag>
                            </template>
                            <template v-if="ucdata.userAuth" v-for="v in ucdata.userAuth.split('\n')">
                                <el-tag size="large" class="btns2 userTag">{{ v }}</el-tag>
                            </template>
                        </div>
                    </template>
                </el-skeleton>
            </div>
        </el-col>
        <el-col :md="12">
            <div class="box">
                <div class="box_title">个人信息</div>
                <el-skeleton style="margin-top: 20px" :loading="! ucdata" :rows="6" animated>
                    <template #default>
                        <el-descriptions style="margin-top: 20px" :column="1" direction="vertical" border>
                            <el-descriptions-item>
                                <template #label>
                                    <i class="fas fa-id-badge"></i>
                                    &nbsp;
                                    账号ID
                                </template>
                                {{ ucdata.id }}
                            </el-descriptions-item>
                            <el-descriptions-item v-if="! ucdata.isMe">
                                <template #label>
                                    <i class="fas fa-signal"></i>
                                    &nbsp;
                                    在线状态
                                </template>
                                <component :is="ucdata.isOnline ? 'el-tag' : 'div'" :type="ucdata.isOnline ? 'success' : 'info'">{{ ucdata.isOnline ? '在线' : '最后在线时间：' + getTimeDesc(ucdata.lastOnlineTime) }}</component>
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <i class="fas fa-phone"></i>
                                    &nbsp;
                                    手机号
                                </template>
                                {{ ucdata.phone }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <i class="fas fa-user-plus"></i>
                                    &nbsp;
                                    注册信息
                                </template>
                                <div>
                                    <span class="stitle">注册时间</span>
                                    {{ getTimeDesc(ucdata.signupTime) }}
                                </div>
                                <div>
                                    <span class="stitle">注册IP</span>
                                    {{ ucdata.signupIP }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </template>
                </el-skeleton>
            </div>
            <div v-if="ucenterOwnerIsMe" class="box" style="margin-top: 20px">
                <div class="box_title">账号安全</div>
                <div class="box_graytitle">安全设置</div>
                <div class="group">
                    <el-button type="primary" size="large" @click="setUdata('pass', '密码', 'password')" plain>
                        <i class="fas fa-key"></i>&emsp;修改密码
                    </el-button>
                </div>
                <div class="box_graytitle">最近登录记录</div>
                <el-table :data="ucdata.loginDetails" :stripe="true" style="margin-top: 20px" max-height="300px">
                    <!-- TNND，被坑两天了，这个el-table-column不能用单标签形式，所以尾部不能用 `/>` 必须用 `></el-table-column>` -->
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="loginTime" label="登录时间" width="200"></el-table-column>
                    <el-table-column prop="loginIP" label="登录IP" width="150"></el-table-column>
                    <el-table-column prop="onlineTime" label="最后在线时间" width="200"></el-table-column>
                    <el-table-column prop="todo" label="操作/说明" min-width="150">
                        <template #default="scope">
                            <el-button v-if="scope.row.tokenActive && (! scope.row.isMe)" type="warning" size="small" @click="dieUserToken(scope.row.id)" plain>强制退出登录</el-button>
                            <span v-if="! scope.row.tokenActive">凭证已过期</span>
                            <span v-if="scope.row.isMe">这是当前设备哦</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://user', '用户中心'],
            ['', '个人中心']
        ],
        isUcenterPage: true
    })
    
    // -- refs
    let ucenterOwnerIsMe = useState('ucenterOwnerIsMe'),
        ucdata = ref(false),
        pageOwner = ref(getRouteParam('uid') || '')
    
    // -- app
    function changeAvatar() {
        selectFile((data) => {
            vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
                p({
                    name: '上传头像',
                    url: u('local://api/user/avatarUpload'),
                    data: vaptchaData,
                    file: data,
                    succText: '稍等一秒新头像就生效啦~'
                })
            })
        })
    }
    function setUdata_doit(key, desc, value) {
        p({
            name: '设置个人信息（' + desc + '）',
            url: u('local://api/user/setUdata'),
            data: { key: key, value: value }
        })
    }
    function setUdata(key, desc, inputType, defaultValue) {
        inputMsg({
            content: '请输入新的' + desc + '~',
            inputType: inputType,
            callback_ok(value) {
                if (inputType == 'password') {
                    inputMsg({
                        content: '请重复输入新的' + desc + '，不然设置错了很麻烦哦~',
                        inputType: inputType,
                        callback_ok(value2) {
                            if (value !== value2) {
                                errMsg('两次输入的' + desc + '不一致呢~')
                                return
                            }
                            setUdata_doit(key, desc, value)
                        }
                    })
                    return
                }
                if (ucdata[key].value === value) {
                    infoMsg('……这不跟之前的一样嘛~')
                    return
                }
                setUdata_doit(key, desc, value)
            },
            defaultValue: defaultValue
        })
    }
    function dieUserToken(id) {
        confMsg({
            content: '确定要将该设备强制退出登录吗？',
            type: 'warning',
            callback_ok: () => {
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
                    p({
                        name: '强制设备退出登录',
                        url: u('local://api/user/userTokenDie'),
                        data: Object.assign({ id: id }, vaptchaData)
                    })
                })
            }
        })
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/user/data'),
        data: { uid: pageOwner.value },
        on_ok(res) {
            ucdata.value = res.data.userData
            ucenterOwnerIsMe.value = ucdata.value.isMe
        },
        on_err: () => '即将返回主页',
        jump_err: () => j(u('local://www')),
        type: 'loop'
    }))
</script>