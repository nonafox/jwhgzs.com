<style scoped>
    .item {
        margin-bottom: 15px;
        border: 1px #ddd solid;
        border-radius: 6px;
        padding: 30px;
    }
    .item_time {
        color: gray;
        font-size: 90%;
    }
    .item_score {
        color: gray;
        font-weight: bold;
        font-size: 240%;
    }
    .item_note {
        margin-top: 10px;
        color: gray;
        font-size: 120%;
        white-space: pre-wrap;
    }
    .item_btn {
        margin-top: 20px;
    }
</style>

<template>
    <div class="box box_ml hcenter">
        <el-image :src="u('static://public/img/xfcl_banner')"></el-image>
        <span class="box_title">主页</span>
        <div class="group">
            <el-button v-if="isAdmin" type="primary" size="large" @click="add" plain>
                <i class="fas fa-plus"></i>&emsp;新建赛程
            </el-button>
        </div>
        <div class="item" v-for="v in schedule">
            <div class="item_score" v-html="v.score"></div>
            <div class="item_time">{{ getTimeDesc(v.time) }}</div>
            <div class="item_note" v-html="v.note"></div>
            <el-button v-show="parseInt(v.forumTopicId)" class="item_btn" size="large" type="primary" plain @click="gotoForum(v.forumTopicId)">
                看战报 & 集锦
            </el-button>
            <el-button v-show="isAdmin" class="item_btn" size="large" plain @click="edit(v)">
                编辑
            </el-button>
            <el-button v-show="isAdmin" class="item_btn" size="large" type="danger" plain @click="del(v.id)">
                删除
            </el-button>
        </div>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://xfcl', '新宁足球冠军联赛'],
            ['', '主页']
        ]
    })
    
    // -- refs
    let udata = useState('udata'),
        schedule = ref([]),
        adminUids = ref([]),
        isAdmin = computed(() => {
            return udata.value && inArray(parseInt(udata.value.id), adminUids.value)
        })
    
    // -- app
    let tortureList = [
        {
            name: '开场时间',
            vname: 'time',
            type: 'datetime'
        },
        {
            name: '比分',
            vname: 'score',
            type: 'text'
        },
        {
            name: '备注（选填）',
            vname: 'note',
            type: 'textarea'
        },
        {
            name: '关联的论坛话题ID（选填）',
            vname: 'forumTopicId',
            type: 'number'
        }
    ]
    function add() {
        torture({
            list: tortureList,
            next(v) {
                p({
                    name: '添加赛程',
                    url: u('local://api/xfcl/schedule/add'),
                    data: v
                })
            }
        })
    }
    function edit(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: tortureList,
            next(v) {
                p({
                    name: '修改赛程',
                    url: u('local://api/xfcl/schedule/edit'),
                    data: Object.assign({ id: odata.id }, v)
                })
            }
        })
    }
    function del(id) {
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            p({
                name: '删除赛程',
                url: u('local://api/xfcl/schedule/del'),
                data: Object.assign({ id: id }, vaptchaData)
            })
        })
    }
    function gotoForum(id) {
        j(u('local://forum/detail') + '/' + id, '_blank')
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/xfcl/schedule'),
        data: {},
        on_ok(data) {
            schedule.value = data.data.schedule
            adminUids.value = data.data.adminUids
        },
        on_err: () => '即将返回主页！',
        jump_err: () => j(u('local://www')),
        type: 'loop'
    }))
</script>