<template>
    <div class="box box_md hcenter">
        <span class="box_title">论坛</span>
        <span class="box_graytitle">{{ (! formData.pid) ? '发布话题' : (formData.id ? '编辑话题' : '话题发言') }}</span>
        <div style="margin-top: 40px;">
            <div class="box_tip2">
                <span class="spanAwesome" style="padding-bottom: 5px;">提示：你输入的内容实时保存哦，不用担心！</span>
                <el-button size="small" plain @click="clear">清空表单</el-button>
            </div>
            <el-form label-width="8rem" :model="formData" label-position="top">
                <el-form-item v-if="formData.pid && (! formData.id)" label="回复话题ID" prop="pid">
                    <el-input type="number" v-model="formData.pid" disabled>
                        <template #prefix>
                            <i class="fas fa-list-ol"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <div v-if="formData.id">
                    <el-form-item label="话题ID" prop="id">
                        <el-input type="number" v-model="formData.id" disabled>
                            <template #prefix>
                                <i class="fas fa-list-ol"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="! formData.pid" label="分类" prop="classify">
                    <el-select v-model="formData.classify" placeholder=" 点击选择分类" @change="saveContent">
                        <el-option v-for="(v, k) in forumData.classifies" :key="k" :label="v" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="! formData.pid" label="标题" prop="title">
                    <el-input type="text" v-model="formData.title" @input="saveContent">
                        <template #prefix>
                            <i class="fas fa-heading"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <client-only>
                        <quill-container title="内容" :form-style="true">
                            <quill v-model="formData.content" title="内容" @input="saveContent"></quill>
                        </quill-container>
                    </client-only>
                </el-form-item>
                <el-divider style="margin-top: 60px;"></el-divider>
                <div style="width: 100%; text-align: center;">
                    <el-button type="primary" size="large" style="width: 50%;" @click="doit" plain round>
                        提交
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
            ['local://forum', '论坛'],
            ['', '发布']
        ]
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
                name: '初始化数据',
                url: u('local://api/forum/detail'),
                data: { id: formData.value.id },
                on_ok(data) {
                    let d = data.data.topicTree[0];
                    if (d.pid) formData.value.pid = d.pid
                    formData.value.classify = (d.classify ? parseInt(d.classify) : null)
                    formData.value.title = d.title
                    formData.value.content = d.content
                },
                on_err: () => '本错误非致命，你可以继续进行操作~',
                type: 'money'
            })
        }
    }
    function saveContent() {
        if (! (formData.value.pid || formData.value.id)) {
            localStorage.setItem('forum_form', JSON.stringify(formData.value))
        }
    }
    function _clear() {
        localStorage.setItem('forum_form', '')
    }
    function clear() {
        confMsg({
            content: '确定要清空已输入的表单内容吗？',
            type: 'warning',
            callback_ok() {
                _clear()
                jumpReload()
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
                name: '发布话题',
                url: u('local://api/forum/upload'),
                data: Object.assign(formData.value, vaptchaData),
                on_ok(data) {
                    _clear()
                    return '即将跳转~'
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
        name: '数据同步',
        url: u('local://api/forum'),
        data: {},
        on_ok(data) {
            forumData.value = data.data.forumData
            if (process.client && ! inited)
                init()
        },
        jump_err: () => j(u('local://forum')),
        on_err: () => '即将返回主页~',
        type: 'loop'
    }))
</script>