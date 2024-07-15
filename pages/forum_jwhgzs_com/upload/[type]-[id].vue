<style scoped>
    .submit-box {
        width: 100%;
        text-align: center;
        padding-top: 10px;
        margin-bottom: 20px;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <span class="box_title">{{ $t('page_title_forum') }}</span>
        <span class="box_graytitle">
            {{ (! formData.pid) ? $t('new_forum_topic') : (formData.id ? $t('edit_forum_topic') : $t('reply_forum_topic')) }}
        </span>
        <div style="margin-top: 40px;">
            <el-form label-width="8rem" :model="formData" label-position="top">
                <el-form-item v-if="formData.pid && (! formData.id)" :label="$t('form_forum_topic_id_to_reply')" prop="pid">
                    <el-input type="number" v-model="formData.pid" disabled>
                        <template #prefix>
                            <i class="fas fa-list-ol"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <div v-if="formData.id">
                    <el-form-item :label="$t('form_forum_topic_id')" prop="id">
                        <el-input type="number" v-model="formData.id" disabled>
                            <template #prefix>
                                <i class="fas fa-list-ol"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="! formData.pid" :label="$t('form_forum_topic_classify')" prop="classify">
                    <el-select v-model="formData.classify" @change="saveContent">
                        <el-option v-for="(v, k) in forumData.classifies" :key="k" :label="$t(v)" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="! formData.pid" :label="$t('form_forum_topic_title')" prop="title">
                    <el-input type="text" v-model="formData.title" @input="saveContent">
                        <template #prefix>
                            <i class="fas fa-heading"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <client-only>
                        <quill-container :title="$t('form_forum_topic_content')" :form-style="true">
                            <quill v-model="formData.content" @input="saveContent"></quill>
                        </quill-container>
                    </client-only>
                </el-form-item>
                <div class="box_tip2" v-if="isOK2save">
                    <span class="spanAwesome" style="padding-bottom: 10px; padding-right: 10px;">
                        {{ $t('forum_form_content_saved_tip') }}
                    </span>
                    <el-button size="small" plain @click="clear">
                        {{ $t('clear_saved_content') }}
                    </el-button>
                </div>
                <div class="submit-box">
                    <el-button type="primary" size="large" style="width: 50%;" @click="doit" plain round>
                        {{ $t('submit') }}
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://forum', 'page_title_forum'],
            ['', 'page_title_publish']
        ],
        mustLogin: true
    })
    
    // -- refs
    let forumData = ref(false),
        formData = ref({
            pid: null,
            id: null,
            classify: null,
            title: '',
            content: ''
        }),
        inited = false
    let isOK2save = computed(() => {
        return ! (formData.value.pid || formData.value.id)
    })
    
    // -- app
    function init() {
        inited = true
        if (localStorage.getItem('forum_form') && (! (formData.value.pid || formData.value.id))) {
            let d = JSON.parse(localStorage.getItem('forum_form'))
            formData.value.classify = d.classify
            formData.value.title = d.title
            formData.value.content = d.content
        }
        if (formData.value.id) {
            p({
                name: $t('api_init_data'),
                url: u('local://api/forum/detail'),
                data: { id: formData.value.id },
                on_ok(data) {
                    let d = data.data.topicTree[0];
                    if (d.pid) formData.value.pid = d.pid
                    formData.value.classify = (d.classify ? parseInt(d.classify) : null)
                    formData.value.title = d.title
                    formData.value.content = d.content
                },
                on_err: () => $t('unimportant_error_tip'),
                type: 'money'
            })
        }
    }
    function saveContent() {
        if (isOK2save.value) {
            localStorage.setItem('forum_form', JSON.stringify(formData.value))
        }
    }
    function _clear() {
        localStorage.setItem('forum_form', '')
    }
    function clear() {
        confMsg({
            content: $t('question_confirm_to_clear_saved_content'),
            type: 'warning',
            callback_ok() {
                _clear()
                succMsg($t('succeeded'))
            }
        })
    }
    function doit() {
        let jump = () => {
            if (formData.value.pid)
                j(u('local://forum/detail') + '/' + formData.value.pid)
            else if (formData.value.id)
                j(u('local://forum/detail') + '/' + formData.value.id)
            else
                j(u('local://forum') + '/' + formData.value.classify)
        }
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            p({
                name: $t('api_new_forum_topic'),
                url: u('local://api/forum/upload'),
                data: Object.assign(formData.value, vaptchaData),
                on_ok(data) {
                    _clear()
                    return $t('ready2jump_general')
                },
                jump: jump
            })
        })
    }
    
    switch (getRouteParam('type')) {
        case 'new':
            formData.value.classify = parseInt(getRouteParam('id'))
            break
        case 'edit':
            formData.value.id = parseInt(getRouteParam('id'))
            break
        case 'reply':
            formData.value.pid = parseInt(getRouteParam('id'))
            break
        default:
            break
    }
    
    await runThread(async () => await p({
        name: $t('api_sync_data'),
        url: u('local://api/forum'),
        data: {},
        on_ok(data) {
            forumData.value = data.data.forumData
            if (import.meta.client && ! inited)
                init()
        },
        jump_err: () => j(u('local://forum')),
        on_err: () => $t('ready2jump_home'),
        type: 'loop'
    }))
</script>