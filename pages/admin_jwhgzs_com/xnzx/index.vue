<template>
    <div class="box box_ml hcenter">
        <div class="box_title">后台管理</div>
        <div class="box_graytitle">新宁空间管理 - 主页</div>
        <el-divider></el-divider>
        <div class="group">
            <el-button type="primary" size="large" @click="addClass" plain>
                <i class="fas fa-plus"></i>&emsp;添加班级
            </el-button>
        </div>
        <el-table :data="classList" max-height="500">
            <el-table-column prop="" label="班级" width="200">
                <template #default="scope">
                    {{ scope.row.year }} 秋届 {{ scope.row.class }} 班
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" min-width="350">
                <template #default="scope">
                    <el-button size="small" type="primary" plain @click="gotoSub(scope.row)">编辑学生列表</el-button>
                    <el-button size="small" plain @click="editClass(scope.row)">编辑基本信息</el-button>
                    <el-button size="small" type="danger" plain @click="delClass(scope.row.id)">删除</el-button>
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
            ['local://admin/xnzx', '新宁空间管理'],
            ['', '主页']
        ]
    })
    
    // -- refs
    let classList = ref([])
    
    // -- app
    function gotoSub(v) {
        j(u('local://admin/xnzx/sub') + '/' + v.year + '-' + v.class)
    }
    let tortureList = [
        {
            name: '届数（即班的入学年份）',
            vname: 'year',
            type: 'number'
        },
        {
            name: '班号（几班就写几号，不含年级）',
            vname: 'class',
            type: 'number'
        }
    ]
    function addClass() {
        torture({
            list: tortureList,
            next(v) {
                p({
                    name: '添加班级',
                    url: u('local://api/admin/xnzx/addClass'),
                    data: v
                })
            }
        })
    }
    function editClass(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: tortureList,
            next(v) {
                p({
                    name: '修改班级基本信息',
                    url: u('local://api/admin/xnzx/editClass'),
                    data: Object.assign({ id: odata.id }, v)
                })
            }
        })
    }
    function delClass(id) {
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            p({
                name: '删除班级',
                url: u('local://api/admin/xnzx/delClass'),
                data: Object.assign({ id: id }, vaptchaData)
            })
        })
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/admin/xnzx'),
        data: {},
        on_ok(data) {
            classList.value = data.data.classList
        },
        on_err: () => '即将返回主页~',
        jump_err: () => j(u('local://admin')),
        type: 'loop'
    }))
</script>