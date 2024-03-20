<template>
    <div class="box box_ml hcenter">
        <div class="box_title">后台管理</div>
        <div class="box_graytitle">短链接管理</div>
        <div class="group">
            <el-button type="primary" size="large" @click="add" plain>
                <i class="fas fa-plus"></i>&emsp;新建短链
            </el-button>
        </div>
        <el-table :data="urlList" max-height="500">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="tag" label="短链接标签" width="100"></el-table-column>
            <el-table-column prop="" label="短链接" width="200">
                <template #default="scope">
                    <el-button size="small" text @click="copy(makeShortUrl(scope.row))">复制</el-button>
                    <el-button size="small" text @click="copy(makeShortUrl2(scope.row))">复制九尾狐内部链接</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="原链接" width="150">
                <template #default="scope">
                    <el-button size="small" text @click="j(scope.row.url, '_blank')">跳转</el-button>
                    <el-button size="small" text @click="copy(scope.row.url)">复制</el-button>
                    <el-button v-if="scope.row.ori_url != scope.row.url" size="small" text @click="copy(scope.row.ori_url)">复制九尾狐内部链接</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" width="200"></el-table-column>
            <el-table-column prop="" label="操作" width="150">
                <template #default="scope">
                    <el-button size="small" plain @click="edit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" plain @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['local://admin', '后台管理'],
            ['', '短链接管理']
        ],
        mustLogin: true
    })
    
    // -- refs
    let urlList = ref([])
    
    // -- app
    function makeShortUrl2(a) {
        return 'shortUrl://' + a.tag
    }
    function makeShortUrl(a) {
        return u(makeShortUrl2(a))
    }
    let tortureList = [
        {
            name: '原链接（可为九尾狐内部链接）',
            vname: 'url',
            type: 'text'
        },
        {
            name: '短链接标签（不填则随机分配）',
            vname: 'tag',
            type: 'text'
        },
        {
            name: '短链接备注（选填）',
            vname: 'note',
            type: 'text'
        }
    ]
    function add() {
        torture({
            list: tortureList,
            next(v) {
                p({
                    name: '新建短链',
                    url: u('local://api/admin/shortUrl/add'),
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
                    name: '修改短链接',
                    url: u('local://api/admin/shortUrl/edit'),
                    data: Object.assign({ id: odata.id }, v)
                })
            }
        })
    }
    function del(id) {
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            p({
                name: '删除短链接',
                url: u('local://api/admin/shortUrl/del'),
                data: Object.assign({ id: id }, vaptchaData)
            })
        })
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/admin/shortUrl'),
        data: {},
        on_ok(data) {
            urlList.value = data.data.urlList
        },
        on_err: () => '即将返回主页~',
        jump_err: () => j(u('local://admin')),
        type: 'loop'
    }))
</script>