<style scoped>
    .topic_item {
        margin-bottom: 15px;
        
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 30px;
    }
    .topic_item_title {
        color: #6E6E6E;
        font-size: 200%;
        font-weight: bold;
    }
    .topic_item_foot {
        font-size: 80%;
        color: gray;
    }
    .topic_item_uinfo {
        margin-bottom: 10px;
    }
    .topic_item_time {
        color: gray;
        font-size: 80%;
    }
</style>

<template>
    <div class="box box_ml hcenter">
        <span class="box_title">{{ $t('page_title_forum') }}</span>
        <el-divider></el-divider>
        <div class="group">
            <div class="group_btns">
                <el-button type="primary" size="large" class="btns" @click="gotoNew" plain>
                    <i class="fas fa-upload"></i>&emsp;{{ $t('new_forum_topic') }}
                </el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <div style="margin-bottom: 15px;">
            <el-check-tag v-for="(v, k) in forumData.classifies" :key="k" class="btns2" :checked="classifyChecked == k" @change="classifyChanged(k)">
                {{ $t(v) }}
            </el-check-tag>
        </div>
        <div>
            <div v-for="(v, k) in topicList" :key="v.id" class="topic_item">
                <custom-a class="aAwesomeX" :href="u('local://forum/detail') + '/' + v.id">
                    <user-infobox class="topic_item_uinfo" :udata="v.udata" :single="true"></user-infobox>
                    <div class="topic_item_title">{{ v.title }}</div>
                    <el-divider></el-divider>
                    <div class="topic_item_foot">
                        <div class="topic_item_time">{{ getTimeDesc(v.postTime) }}</div>
                        <div style="margin-top: 5px;">
                            <i class="fas fa-eye"></i>&nbsp;{{ v.looks }}
                            &nbsp;&nbsp;
                            <i class="fas fa-thumbs-up"></i>&nbsp;{{ v.likes }}
                            &nbsp;&nbsp;
                            <i class="fas fa-comment-dots"></i>&nbsp;{{ v.replys }}
                        </div>
                    </div>
                </custom-a>
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
            ['', 'page_title_home']
        ]
    })
    
    // -- refs
    let udata = useState('udata'),
        forumData = ref(false),
        topicList = ref(false),
        classifyChecked = ref(getRouteParam('classify') ? parseInt(getRouteParam('classify')) : 0),
        isAdmin = computed(() => {
            return udata.value && inArray(parseInt(udata.value.id), forumData.value.adminUids)
        })
    
    // -- app
    function classifyChanged(id) {
        j('/' + id)
    }
    function gotoNew() {
        let cid = (
            (inArray(parseInt(classifyChecked.value), forumData.value.adminClassifies) && (! isAdmin.value))
                ? forumData.value.defaultClassify : parseInt(classifyChecked.value)
        )
        j(u('local://forum/upload') + '/new-' + cid)
    }
    
    await runThread(async () => await p({
        name: $t('api_sync_data'),
        url: u('local://api/forum'),
        data: { classify: (getRouteParam('classify') ? parseInt(getRouteParam('classify')) : 0) },
        on_ok(data) {
            forumData.value = data.data.forumData
            topicList.value = data.data.topicList
        },
        on_err: () => $t('ready2jump_home'),
        jump_err: () => j(u('local://www')),
        type: 'loop'
    }))
</script>