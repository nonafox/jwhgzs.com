<style scoped>
    .detail_heihei {
        font-size: 80%;
        color: gray;
    }
    .item {
        border: 1px solid #ddd;
        border-radius: 6px;
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
    .article {
        margin-bottom: 20px;
        
        padding: 30px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background-color: #FAFAFA;
    }
    .article_title {
        font-size: 150%;
        font-weight: bold;
        font-family: '楷体';
        text-align: center;
    }
    .article_author {
        margin-top: 10px;
        
        font-size: 125%;
        font-family: '楷体';
        text-align: center;
    }
    .article_content {
        margin-top: 20px;
        
        font-size: 100%;
        white-space: pre-wrap;
        tab-size: 0;
        font-family: '仿宋';
    }
    .article_content_p {
        text-indent: 2rem;
    }
    .article_content_p_sharp {
        font-family: '楷体';
        font-style: italic;
    }
    .article_content_p_sharp_r {
        text-align: right;
    }
    .btnGroup {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .article_btns {
        text-align: center;
        color: gray;
    }
    .article_btn:not(:last-child) {
        margin-right: 20px;
    }
    .article_content_subtitle {
        text-indent: 0 !important;
        font-family: '楷体';
        font-size: 125%;
        text-align: center;
    }
    .article_content_subtitle2 {
        /* line-height用无单位数值，则1表示正常行高度，2表示两倍，etc */
        line-height: 1.8;
        padding: 10px;
        background-color: #ddd;
    }
</style>

<template>
    <div class="box box_ml hcenter">
        <span class="box_title">新宁空间</span>
        <span class="box_graytitle">班级周报 - 详情</span>
        <el-divider></el-divider>
        <el-skeleton :loading="! weeklyDetail" :throttle="50" :rows="4" animated>
            <template #default>
                <el-row>
                    <el-tag :span="-1" :type="weeklyDetail.finished ? 'success' : 'info'">
                        {{ weeklyDetail.finished ? '已出版~' : '总编辑中（' + finishProgress(weeklyDetail) + '%）' }}
                    </el-tag>
                    <el-tag v-if="parseInt(weeklyDetail.nameInvisible)" :span="-1" type="" style="margin-left: 10px;">
                        隐藏作者名
                    </el-tag>
                    <div :span="-1" style="margin-left: 10px;">
                        <span class="item_class">{{ weeklyDetail.year }}秋届</span>
                        <span class="item_class">{{ weeklyDetail.class }}班</span>
                        <span class="item_term">{{ weeklyDetail.term }} 第{{ weeklyDetail.num }}期 {{ weeklyDetail.note }}</span>
                    </div>
                </el-row>
                <div style="margin-top: 20px;">
                    <div>
                        <span class="item_count">上报作文：{{ weeklyDetail.full_progress }}篇</span>
                        &nbsp;
                        <span v-if="! weeklyDetail.finished" class="item_count">总编辑进度：{{ finishProgressText(weeklyDetail) }}</span>
                    </div>
                    <div class="group">
                        <el-button size="small" @click="foldPeopleList">{{ isShowPeopleList ? '隐藏详情' : '详情' }}</el-button>
                        <el-button v-show="isAdmin" size="small" @click="editWeekly" plain>修改周报信息</el-button>
                        <el-button v-show="isAdmin" size="small" @click="forceFinish" plain>{{ parseInt(weeklyDetail.forceFinished) ? '取消' : '' }}强制出版</el-button>
                        <el-button v-show="isAdmin" size="small" @click="downloadWeekly" plain>下载文档</el-button>
                        <el-button v-show="isAdmin" size="small" type="danger" @click="deleteWeekly" plain>删除周报</el-button>
                    </div>
                </div>
                <el-divider v-show="isShowPeopleList"></el-divider>
                <!-- 这个table的按钮控制用v-if不行，可能是因为按钮控制（可以点很快），省性能懒加载了。v-show用的是display: none; -->
                <!-- 这里必须等数据来了之后才能显示（v-if），不然就会偶尔有莫名其妙的错误 -->
                <el-table v-if="weeklyDetail" v-show="isShowPeopleList" :data="articleList" :stripe="true" max-height="500">
                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-button v-if="parseInt(scope.row.status)" @click="jumpArticle(scope.row.id)" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" width="150">
                        <template #default="scope">
                            <strong>{{ scope.row.title }}</strong>
                        </template>
                    </el-table-column>
                    <el-table-column label="作者" width="150">
                        <template #default="scope">
                            <component v-if="nameVisible" :is="scope.row.author[2] ? 'el-link' : 'span'" type="primary" target="_blank" :href="u('local://user/ucenter') + '/' + scope.row.author[2]">
                                {{ scope.row.author[0] }}号 {{ scope.row.author[1] }}
                            </component>
                            <span v-else class="detail_heihei">你猜~</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="打稿人" min-width="150">
                        <template #default="scope">
                            <component v-if="nameVisible" :is="scope.row.typist[2] ? 'el-link' : 'span'" type="primary" target="_blank" :href="u('local://user/ucenter') + '/' + scope.row.typist[2]">
                                {{ scope.row.typist[0] }}号 {{ scope.row.typist[1] }}
                            </component>
                            <span v-else class="detail_heihei">你猜~</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" min-width="100">
                        <template #default="scope">
                            <el-tag :type="parseInt(scope.row.status) == 2 ? 'success' : (parseInt(scope.row.status) == 1 ? '' : 'info')">
                                {{ parseInt(scope.row.status) == 2 ? '打稿完成' : (parseInt(scope.row.status) == 1 ? '审核中' : '未提交') }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-skeleton>
        <div v-if="weeklyDetail" class="box_tip" style="text-align: center; font-weight: bold;">
            {{ copyright }}
        </div>
        <el-divider v-if="! weeklyDetail"></el-divider>
        <br/>
        <el-skeleton :loading="! weeklyDetail" :throttle="50" :rows="8" animated>
            <template #default>
                <template v-for="(v, k) in articleList" :key="v.id">
                    <div v-if="parseInt(v.status)" class="article">
                        <a class="aAwesome2" :name="'article_' + v.id"></a>
                        <div class="article_btns">
                            <el-link class="article_btn" v-show="udata && isAdmin && parseInt(v.status)" @click="passArticle(v.id)" size="small">
                                <i class="fas fa-drafting-compass"></i>&nbsp;{{ parseInt(v.status) == 2 ? '取消' : '' }}过审
                            </el-link>
                            <el-link class="article_btn" v-show="udata && parseInt(v.status) == 1" @click="editArticle(v.id)" size="small">
                                <i class="fas fa-edit"></i>&nbsp;编辑
                            </el-link>
                        </div>
                        <el-divider></el-divider>
                        <div class="article_title">{{ v.title }}</div>
                        <div v-if="nameVisible" class="article_author">{{ v.author[1] }}</div>
                        <div class="article_content">
                            <p v-if="v.tiji" class="article_content_p article_content_p_sharp">{{ v.tiji }}</p>
                            <p v-if="v.tiji" class="article_content_p article_content_p_sharp article_content_p_sharp_r">——题记</p>
                            <p v-for="v2 in v.content" :key="v2" :class="{ article_content_p: true, article_content_subtitle: v2.replace(/^\s+/, '').startsWith('#') }">
                                <span :class="{ article_content_subtitle2: v2.replace(/^\s+/, '').startsWith('#') }">{{ v2.replace(/^\s+/, '').startsWith('#') ? v2.replace(/^\s+/, '').replace(/#/g, '') : v2 }}</span>
                            </p>
                            <p v-if="v.houji" class="article_content_p article_content_p_sharp">{{ v.houji }}</p>
                            <p v-if="v.houji" class="article_content_p article_content_p_sharp article_content_p_sharp_r">——后记</p>
                        </div>
                    </div>
                </template>
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
            ['', '详情']
        ]
    })
    
    // -- refs
    let udata = useState('udata'),
        copyright = ref('版权归本网站及原作者所有，未经本网站或原作者允许不得转载本周报内容！'),
        pid = ref(getRouteParam('id')),
        weeklyDetail = ref(false),
        articleList = ref(false),
        isShowPeopleList = ref(false)
    let isAdmin = computed(() => {
        return udata.value && weeklyDetail.value && inArray(parseInt(udata.value.id), weeklyDetail.value.adminUids)
    })
    let nameVisible = computed(() => {
        return weeklyDetail.value && ((! parseInt(weeklyDetail.value.nameInvisible)) || isAdmin.value)
    })
    
    // -- app
    function copyTip() {
        warnMsg('复制成功。<br/><br/>' + copyright.value)
    }
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
    function jumpArticle(id) {
        j('#article_' + id)
    }
    function getArticleDetailByAuthor(i) {
        // 适配一作者多文章
        let count = 0, item = weeklyDetail.value.authors[i][0]
        for (let k in weeklyDetail.value.authors) {
            let v = weeklyDetail.value.authors[k][0]
            if (v == item) {
                count ++
            }
            if (v == item && k == i) {
                break
            }
        }
        let count2 = 0
        for (let k in articleList.value) {
            let v = articleList.value[k]
            if (v.author[0] == item) {
                count2 ++
                if (count2 == count) {
                    return v
                }
            }
        }
        return false
    }
    function passArticle(id) {
        confMsg({
            content: '确定要审核/取消过审该稿件吗？',
            type: 'warning',
            callback_ok() {
                p({
                    name: '稿件审核',
                    url: u('local://api/xnzx/weekly/pass'),
                    data: { id: id }
                })
            }
        })
    }
    function editArticle(id) {
        j(u('local://xnzx/weekly/upload') + '/edit-' + id)
    }
    function foldPeopleList() {
        isShowPeopleList.value = (! isShowPeopleList.value)
    }
    function editWeekly() {
        j(u('local://xnzx/weekly/upload') + '/adminedit-' + pid.value)
    }
    function downloadWeekly() {
        if (isWechatOrQQ()) {
            errMsg('在微信、QQ内置浏览框无法下载文件哦，请用浏览器打开本网站~')
            return
        }
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            j(u('local://api/xnzx/weekly/download') + '?id=' + pid.value + '&userToken=' + getCookie('userToken') + '&vaptchaData=' + encodeURIComponent(JSON.stringify(vaptchaData.vaptchaData)), '_blank')
        })
    }
    function deleteWeekly() {
        confMsg({
            content: '确定要删除当前周报吗？删除后不可恢复！',
            type: 'warning',
            callback_ok() {
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
                    p({
                        name: '删除周报',
                        url: u('local://api/xnzx/weekly/delete'),
                        data: Object.assign({ id: pid.value }, vaptchaData),
                        jump: () => j(u('local://xnzx/weekly'))
                    })
                })
            }
        })
    }
    function forceFinish() {
        confMsg({
            content: '确定要强制出版/取消强制出版吗？',
            type: 'warning',
            callback_ok() {
                p({
                    name: '强制出版/取消强制出版',
                    url: u('local://api/xnzx/weekly/forceFinish'),
                    data: { id: pid.value }
                })
            }
        })
    }
    
    // only trigger once (reset when refresh or router jump)
    onMounted(() => document.addEventListener('copy', copyTip, { once: true }))
    onUnmounted(() => document.removeEventListener('copy', copyTip))
    let jumped = false
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/xnzx/weekly/detail'),
        data: { id: pid.value },
        on_ok(res) {
            weeklyDetail.value = res.data.weeklyDetail
            articleList.value = res.data.articleList
            if (! jumped)
                j_hash();
            jumped = true
        },
        on_err: () => '即将跳转主页',
        jump_err: () => j(u('local://xnzx/weekly')),
        type: 'loop'
    }))
</script>