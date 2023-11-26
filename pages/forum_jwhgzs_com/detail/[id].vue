<style scoped>
    .topic_item {
        margin-bottom: 15px;
        
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 20px;
    }
    .topic_item_nonreply {
        background-color: #F7F7F7;
    }
    .topic_item_title {
        margin-bottom: 25px;
        color: #6E6E6E;
        text-align: center;
        font-size: 250%;
        font-weight: bold;
    }
    .topic_item_content {
        margin-top: 10px;
        padding: 10px;
        border-radius: 10px;
    }
    /* 深度选择，参考：https://blog.csdn.net/m0_51431448/article/details/123003864 */
    :deep(.topic_item_content) img {
        width: 100%;
        max-width: 100% !important;
    }
    .topic_item_btn {
        font-size: 90% !important;
        margin-left: 15px;
    }
    .topic_item_btns {
        float: right;
        padding: 10px 15px;
        color: gray;
    }
    .topic_item_id {
        position: absolute;
        border-left: none;
        border-top: none;
        margin: 1px;
    }
</style>

<template>
    <div class="box box_ml hcenter">
        <span class="box_title">{{ $t('page_title_forum') }}</span>
        <span class="box_graytitle">{{ $t('page_title_forum_topic_detail') }}</span>
        <el-divider></el-divider>
        <div class="group">
            <el-button type="primary" size="large" @click="gotoReply" plain>
                <i class="fas fa-comments"></i>&emsp;{{ $t('reply_forum_topic') }}
            </el-button>
        </div>
        <el-divider></el-divider>
        <div v-if="topicTree && topicTree[0]">
            <div class="topic_item_title">{{ topicTree[0].title }}</div>
            <div>
                <div v-for="(v, k) in topicTree" :key="v.id">
                    <el-tag size="small" :type="k == 0 ? 'success' : ''" class="topic_item_id">#{{ v._id }}</el-tag>
                    <span class="topic_item_btns">
                        <el-link class="topic_item_btn" v-if="k == 0" disabled>
                            <i class="fas fa-eye"></i>&nbsp;{{ v.looks }}
                        </el-link>
                        <el-link class="topic_item_btn" :type="v.liked ? 'primary' : 'default'" plain @click="like(v.id)">
                            <i class="fas fa-thumbs-up"></i>&nbsp;{{ v.likes }}
                        </el-link>
                        <el-link v-show="isAdmin" class="topic_item_btn" @click="editIt(v.id)">
                            <i class="fas fa-edit"></i>&nbsp;{{ $t('edit') }}
                        </el-link>
                        <el-link v-show="isAdmin" class="topic_item_btn" type="danger" @click="deleteIt(v.id)">
                            <i class="fas fa-trash-alt"></i>&nbsp;{{ $t('delete') }}
                        </el-link>
                    </span>
                    <div :class="{ topic_item: true, topic_item_nonreply: (k == 0) }">
                        <user-infobox :udata="v.udata" :time="v.postTime"></user-infobox>
                        <div class="topic_item_content">
                            <div class="ql-container ql-snow">
                                <div class="ql-editor" v-html="v.content"></div>
                            </div>
                        </div>
                    </div>
                    <el-divider v-if="k == 0"></el-divider>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://forum', 'page_title_forum'],
            ['', 'page_title_forum_topic_detail']
        ]
    })
    
    // -- refs
    let udata = useState('udata'),
        forumData = ref(false),
        topicTree = ref(false),
        isAdmin = computed(() => {
            return udata.value && inArray(parseInt(udata.value.id), forumData.value.adminUids)
        })
    
    // -- app
    function like(id) {
        p({
            name: $t('api_like_or_cancel'),
            url: u('local://api/forum/like'),
            data: { id: id }
        })
    }
    function gotoReply() {
        j(u('local://forum/upload') + '/reply-' + getRouteParam('id'))
    }
    function editIt(id) {
        j(u('local://forum/upload') + '/edit-' + id)
    }
    function deleteIt(id) {
        confMsg({
            content: $t('question_confirm_to_delete'),
            type: 'warning',
            callback_ok() {
                vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
                    p({
                        name: $t('api_delete_forum_topic'),
                        url: u('local://api/forum/delete'),
                        data: Object.assign({ id: id }, vaptchaData),
                        jump_err: () => id == topicTree.value[0].id && j(u('local://forum'))
                    })
                })
            }
        })
    }
        
    await runThread(async () => await p({
        name: $t('api_sync_data'),
        url: u('local://api/forum/detail'),
        data: { id: getRouteParam('id') ? parseInt(getRouteParam('id')) : 0 },
        on_ok(res) {
            topicTree.value = res.data.topicTree
            forumData.value = res.data.forumData
        },
        on_err: () => $t('ready2jump_home'),
        jump_err: () => j(u('local://forum')),
        type: 'loop'
    }))
</script>