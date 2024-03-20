<style scoped>
    .item {
        margin-bottom: 20px;
        
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
    }
    .item_class {
        color: #6E6E6E;
        font-size: 150%;
        font-weight: bold;
    }
    .item_term {
        margin-left: 10px;
        
        color: skyblue;
        font-size: 150%;
    }
    .item_count {
        color: gray;
        font-size: 80%;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <span class="box_title">新宁空间</span>
        <span class="box_graytitle">班级周报</span>
        <div class="group">
            <div class="group_btns">
                <el-button class="btns" type="primary" size="large" @click="goto(0)" plain>
                    <i class="fas fa-upload"></i>&emsp;上传文章
                </el-button>
                <el-button v-show="isAdmin" class="btns" size="large" @click="goto(1)" plain>
                    <i class="fas fa-plus"></i>&emsp;发起周报
                </el-button>
                <el-button class="btns" size="large" @click="download" plain>
                    <i class="fas fa-download"></i>&emsp;一键下载自己的稿件汇总
                </el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <el-skeleton :loading="! weeklyList" :throttle="100" :rows="5" animated>
            <template #default>
                <div v-for="(v, k) in weeklyList" :key="v.id" class="item">
                    <custom-a class="aAwesomeX" :href="u('local://xnzx/weekly/detail') + '/' + v.id">
                        <el-row>
                            <el-tag :span="-1" :type="v.finished ? 'success' : 'info'" style="margin-bottom: 10px;">
                                {{ v.finished ? '已出版~' : '总编辑中（' + finishProgress(v) + '%）' }}
                            </el-tag>
                            <div :span="-1" style="margin-left: 10px; margin-bottom: 10px;">
                                <span class="item_class">{{ v.year }}秋届</span>
                                <span class="item_class">{{ v.class }}班</span>
                                <span class="item_term">{{ v.term }} 第{{ v.num }}期 {{ v.note }}</span>
                            </div>
                        </el-row>
                        <div style="margin-top: 20px;">
                            <span class="item_count">上报作文：{{ v.full_progress }}篇</span>
                            &nbsp;
                            <span v-if="! v.finished" class="item_count">总编辑进度：{{ finishProgressText(v) }}</span>
                        </div>
                    </custom-a>
                </div>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://xnzx', '新宁空间'],
            ['local://xnzx/weekly', '班级周报'],
            ['', '主页']
        ]
    })
    
    // -- refs
    let udata = useState('udata'),
        weeklyList = ref(false),
        weeklyData = ref(false)
    let isAdmin = computed(() => {
        return udata.value && weeklyData.value && inArray(parseInt(udata.value.id), weeklyData.value.adminUids)
    })
    
    // -- app
    function finishProgress(v) {
        if (v.full_progress == 0)
            return 0
        return (parseInt(v.finished_progress) / parseInt(v.full_progress) * 100).toFixed(0)
    }
    function finishProgressText(v) {
        if (v.full_progress == 0)
            return ''
        return parseInt(v.finished_progress) + '/' + parseInt(v.full_progress)
    }
    function goto(i) {
        switch (i) {
            case 0:
                j(u('local://xnzx/weekly/upload') + '/upload--')
                break
            case 1:
                j(u('local://xnzx/weekly/upload') + '/adminnew--')
                break
            default:
                break
       } 
    }
    function download() {
        if (! udata.value) {
            errMsg('请先登录哦~')
            return
        }
        if (isWechatOrQQ()) {
            errMsg('在微信、QQ内置浏览框无法下载文件哦，请用浏览器打开本网站~')
            return
        }
        inputMsg({
            content: '请输入你的届数（即你入学的年份）：',
            inputType: 'number',
            callback_ok(year) {
                inputMsg({
                    content: '请输入你的班级：',
                    inputType: 'number',
                    callback_ok(class_) {
                        inputMsg({
                            content: '请输入你的学号：',
                            inputType: 'number',
                            callback_ok(cid) {
                                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
                                    j(u('local://api/xnzx/weekly/download') + '?year=' + year + '&class=' + class_ + '&cid=' + cid + '&userToken=' + getCookie('userToken') + '&vaptchaData=' + encodeURIComponent(JSON.stringify(vaptchaData.vaptchaData)), '_blank')
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/xnzx/weekly'),
        on_ok(res) {
            weeklyData.value = res.data.weeklyData
            weeklyList.value = res.data.weeklyList
        },
        on_err: () => '即将返回主页',
        jump_err: () => j(u('local://xnzx')),
        type: 'loop'
    }))
</script>