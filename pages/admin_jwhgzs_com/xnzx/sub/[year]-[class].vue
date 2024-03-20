<style scoped>
    .title {
        color: #6E6E6E;
        text-align: center;
        font-size: 250%;
        font-weight: bold;
    }
</style>

<template>
    <div class="box box_ml hcenter">
        <div class="box_title">后台管理</div>
        <div class="box_graytitle">新宁空间管理 - 详情</div>
        <div class="title">{{ year }} 秋届 {{ class_ }} 班</div>
        <div class="group">
            <el-button type="primary" size="large" @click="addStudent" plain>
                <i class="fas fa-plus"></i>&emsp;添加学生
            </el-button>
        </div>
        <el-table :data="studentList" max-height="500">
            <el-table-column prop="sid" label="学号" width="80"></el-table-column>
            <el-table-column prop="name" label="姓名" width="150"></el-table-column>
            <el-table-column prop="" label="性别" width="80">
                <template #default="scope">
                    {{ scope.row.sex == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" width="80">
                <template #default="scope">
                    <el-tag :type="scope.row.disabled == 1 ? 'danger' : ''">{{ scope.row.disabled == 1 ? '禁用' : '正常' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="" label="九尾狐账号ID" width="150">
                <template #default="scope">
                    <span v-if="! (+ scope.row.uid)">未绑定</span>
                    <el-link v-else type="primary" @click="jumpUcenter(scope.row.uid)">{{ scope.row.uid }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" min-width="300">
                <template #default="scope">
                    <el-button size="small" plain @click="editStudent(scope.row)">编辑基本信息</el-button>
                    <el-button size="small" plain @click="disableStudent(scope.row)">设置状态</el-button>
                    <el-button size="small" plain @click="linkStudentAccount(scope.row)">设置九尾狐账号</el-button>
                    <el-button size="small" type="danger" plain @click="delStudent(scope.row.id)">删除</el-button>
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
            ['', '详情']
        ],
        mustLogin: true
    })
    
    // -- refs
    let year = ref(getRouteParam('year')), class_ = ref(getRouteParam('class'))
    let studentList = ref([])
    
    // -- app
    function jumpUcenter(uid) {
        j(u('local://user/ucenter') + '/' + uid, '_blank')
    }
    let tortureList = [
        {
            name: '学号',
            vname: 'sid',
            type: 'number'
        },
        {
            name: '姓名',
            vname: 'name',
            type: 'text'
        },
        {
            name: '性别',
            vname: 'sex',
            type: 'select',
            appendConf: {
                inputOptions: [
                    { label: '男', value: '1' },
                    { label: '女', value: '2' }
                ]
            }
        }
    ]
    function addStudent() {
        torture({
            list: tortureList,
            next(v) {
                p({
                    name: '添加学生',
                    url: u('local://api/admin/xnzx/addStudent'),
                    data: Object.assign({ year: year.value, 'class': class_.value }, v)
                })
            }
        })
    }
    function editStudent(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: tortureList,
            next(v) {
                p({
                    name: '修改学生基本信息',
                    url: u('local://api/admin/xnzx/editStudent'),
                    data: Object.assign({ id: odata.id }, v)
                })
            }
        })
    }
    function disableStudent(data) {
        inputMsg({
            content: '请选择状态：',
            inputType: 'select',
            inputOptions: [
                { label: '正常', value: '0' },
                { label: '禁用', value: '1' }
            ],
            defaultValue: data.disabled,
            callback_ok(disabled) {
                p({
                    name: '设置学生状态',
                    url: u('local://api/admin/xnzx/disableStudent'),
                    data: { id: data.id, disabled: disabled }
                })
            }
        })
    }
    function linkStudentAccount(data) {
        inputMsg({
            content: '请选择操作：',
            inputType: 'select',
            inputOptions: [
                { label: '绑定/修改', value: 0 },
                { label: '解绑', value: 1 }
            ],
            defaultValue: 0,
            callback_ok(type) {
                if (type == 0) {
                    inputMsg({
                        content: '请输入要绑定的九尾狐账号ID：',
                        inputType: 'number',
                        defaultValue: parseInt(data.uid),
                        callback_ok(uid) {
                            if (! uid) {
                                infoMsg('没填完信息哦~')
                                return
                            }
                            if (uid == data.uid) {
                                infoMsg('数据没有变哦！')
                                return
                            }
                            p({
                                name: '绑定学生的九尾狐账号',
                                url: u('local://api/admin/xnzx/linkStudentAccount'),
                                data: { id: data.id, uid: uid }
                            })
                        }
                    })
                }
                else {
                    p({
                        name: '解绑学生的九尾狐账号',
                        url: u('local://api/admin/xnzx/linkStudentAccount'),
                        data: { id: data.id, uid: null }
                    })
                }
            }
        })
    }
    function delStudent(id) {
        vaptchaGo(config.value.VAPTCHA_CONFIG.scenes.important, (vaptchaData) => {
            p({
                name: '删除学生',
                url: u('local://api/admin/xnzx/delStudent'),
                data: Object.assign({ id: id }, vaptchaData)
            })
        })
    }
    
    await runThread(async () => await p({
        name: '数据同步',
        url: u('local://api/admin/xnzx/sub'),
        data: { year: year.value, 'class': class_.value },
        on_ok(data) {
            studentList.value = data.data.studentList
        },
        on_err: () => '即将返回主页~',
        jump_err: () => j(u('local://admin')),
        type: 'loop'
    }))
</script>