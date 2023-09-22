<style scoped>
    .link {
        cursor: pointer;
        border-radius: 20px;
        border-bottom-left-radius: 0;
        border: 1px solid #ccc;
        padding: 15px;
        margin-top: 15px;
    }
    .link.disabled {
        cursor: not-allowed;
        background-color: #eee;
        color: #ccc !important;
    }
    .link.normal {
        cursor: unset;
    }
    .link.disabled>* {
        color: #ccc !important;
    }
    .link_title {
        margin-left: 20px;
        color: #ccc;
        font-size: 150%;
        vertical-align: middle;
    }
    .link_img {
        height: 5rem;
        vertical-align: middle;
    }
    .strong {
        border: 1px solid #409EFF !important;
        background-color: #409EFF !important;
        color: white !important;
    }
    .strong>* {
        color: white !important;
        border-color: white !important;
    }
    .lbtn {
        display: inline-block;
        cursor: pointer;
        min-width: 5rem;
        border-bottom-right-radius: 10px;
        border: 1px solid #ccc;
        padding: 7px 10px;
        margin: 10px;
        margin-left: 0;
        color: gray;
        text-align: center;
        font-size: 90%;
    }
    .lbtn.mini {
        font-size: 80%;
        min-width: 3rem;
        padding: 5px;
        margin: 7px;
        margin-left: 0;
    }
    .rbtn {
        display: inline-block;
        cursor: pointer;
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        border: 1px solid #ccc;
        padding: 5px;
        margin: 5px;
        margin-left: 0;
        color: gray;
        text-align: center;
        font-size: 80%;
    }
    :deep(.strong) .hover:hover {
        border: 1px solid rgba(255, 255, 255, .8) !important;
        color: rgba(255, 255, 255, .8) !important;
        transition: all .3s;
    }
    .hover:hover {
        border: 1px solid #409EFF;
        color: #409EFF;
        transition: all .3s;
    }
    .tip {
        font-size: 80%;
        color: gray;
    }
    .alg_p1 {
        display: flex;
        width: 100%;
        align-items: center;
    }
    .alg_p2 {
        margin-top: 20px;
        width: 100%;
    }
    .alg_name {
        margin-left: 20px;
        color: gray;
        font-size: 150%;
        font-weight: bold;
    }
    .alg_lines {
        margin-top: 10px;
        padding: 10px;
    }
    .alg_line {
        color: gray;
        line-height: 2.5;
    }
    .alg_line_n {
        background-color: #ccc;
        color: gray;
        font-weight: bold;
        border-radius: 5px;
        border-bottom-left-radius: 0;
        padding: 5px;
        margin-right: 15px;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <span class="box_title">公式</span>
        <span class="box_graytitle">Algorithms</span>
        <el-divider></el-divider>
        <div v-if="cube_id" class="lbtn hover" @click="return_">
            <i class="fa fa-undo"></i>
            {{ $t('return') }}
        </div>
        <div v-show="isAdmin" class="lbtn hover" @click="addCube">
            <i class="fa fa-plus-circle"></i>
            {{ $t('add_cube') }}
        </div>
        <template v-for="v in classes">
            <div v-if="! cube_id || cube_id == v.id" class="link hover" :class="{ strong: (cube_id == v.id), normal: (cube_id == v.id) }" @click="cube_id != v.id && jump(v.id)">
                <img class="link_img" :src="vimg(v.x)"/>
                <span class="link_title">{{ v.name }}</span>
                <div v-show="cube_id && isAdmin" class="lbtn mini hover" style="margin-left: 20px;" @click="delCube(cube_id)">
                    <i class="fa fa-trash-alt"></i>
                    {{ $t('delete') }}
                </div>
                <div v-show="cube_id && isAdmin" class="lbtn mini hover" @click="editCube(v)">
                    <i class="fa fa-edit"></i>
                    {{ $t('edit') }}
                </div>
            </div>
            <div v-if="cube_id == v.id">
                <div v-for="v2 in v.alg_sets" class="lbtn hover" :class="{ strong: (alg_set_id == v2.id) }" @click="jump(v.id, v2.id)">
                    {{ v2.name }}
                </div>
                <div>
                    <div v-show="isAdmin" class="lbtn mini hover" @click="addAlgSet">
                        <i class="fa fa-plus-circle"></i>
                        {{ $t('add_cube_alg_set') }}
                    </div>
                    <div v-show="isAdmin && alg_set_id" class="lbtn mini hover" @click="editAlgSet(cset)">
                        <i class="fa fa-edit"></i>
                        {{ $t('edit_cube_alg_set') }}
                    </div>
                    <div v-show="isAdmin && alg_set_id" class="lbtn mini hover" @click="delAlgSet(alg_set_id)">
                        <i class="fa fa-trash-alt"></i>
                        {{ $t('del_cube_alg_set') }}
                    </div>
                    <div v-show="isAdmin && alg_set_id" class="lbtn mini hover" @click="addAlg">
                        <i class="fa fa-plus-circle"></i>
                        {{ $t('add_cube_alg') }}
                    </div>
                </div>
            </div>
            <span v-if="cube_id == v.id && ! alg_set_id" class="tip">{{ $t('please_select_alg_set') }}</span>
            <div v-else-if="cube_id == v.id">
                <template v-for="(v3, k3) in algs">
                    <div class="link normal">
                        <div class="alg_p1">
                            <img :src="vimg(v.x, v3.salgs[0] ? v3.salgs[0].alg : '', cset.algs_view, cset.algs_stage, v3.fd)"/>
                            <div class="alg_name">{{ v3.name }}</div>
                        </div>
                        <div class="alg_p2">
                            <div class="alg_lines">
                                <template v-for="(v4, k4) in v3.salgs">
                                    <div v-show="isShowAll(k3) || k4 <= algs_fold_more_than - 1" class="alg_line">
                                        <span class="alg_line_n">{{ k4 + 1 }}</span>
                                        <span>{{ v4.alg }}</span>
                                        <span style="margin-left: 20px; line-height: 1;">
                                            <span class="rbtn hover" @click="editSalg(v4)">
                                                <i class="fa fa-edit"></i>
                                            </span>
                                            <span class="rbtn hover" @click="delSalg(v4.id)">
                                                <i class="fa fa-trash-alt"></i>
                                            </span>
                                        </span>
                                    </div>
                                </template>
                            </div>
                            <div v-if="v3.salgs.length > algs_fold_more_than" class="lbtn mini hover" @click="setShowAll(k3)">
                                <i v-if="! isShowAll(k3)" class="fa fa-chevron-circle-down"></i>
                                <i v-else class="fa fa-chevron-circle-up"></i>
                                {{ isShowAll(k3) ? $t('fold') : $t('unfold') }}
                            </div>
                            <div v-show="isAdmin" class="lbtn mini hover" @click="addSalg(v3.id)">
                                <i class="fa fa-plus-circle"></i>
                                {{ $t('add_salg') }}
                            </div>
                            <div v-show="isAdmin" class="lbtn mini hover" @click="editAlg(v3)">
                                <i class="fa fa-edit"></i>
                                {{ $t('edit') }}
                            </div>
                            <div v-show="isAdmin" class="lbtn mini hover" @click="delAlg(v3.id)">
                                <i class="fa fa-trash-alt"></i>
                                {{ $t('delete') }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['cuberin://', 'page_title_cuberin'],
            ['', 'page_title_algorithms']
        ],
        isntMainDomain: true,
        logo_img: 'static://public/img/cuberin_logo',
        logo_link: 'cuberin://'
    })
    
    // -- refs
    const algs_fold_more_than = 5
    let udata = useState('udata'),
        [cube_id, alg_set_id] = getRouteParam('params').split('-'),
        classes = ref([]),
        algs = ref([]),
        showAlls = ref({}),
        adminUids = ref([])
    let ccube = computed(() => {
        if (! cube_id) return
        for (let v of classes.value) {
            if (v.id == cube_id)
                return v
        }
    }), cset = computed(() => {
        if (! alg_set_id) return
        for (let v of ccube.value.alg_sets) {
            if (v.id == alg_set_id)
                return v
        }
    }), isAdmin = computed(() => {
        return udata.value && inArray(parseInt(udata.value.id), adminUids.value)
    })
    
    // -- app
    function vimg(x, alg = '', view = '', stage = '', fd = '') {
        return u(`local://api/cuberin/visualcube/visualcube?fmt=svg&bg=t&pzl=${x}${! fd ? '&case=' + alg : ''}&view=${view}&stage=${stage}` + (fd ? '&fd=' + fd : ''))
    }
    function jump(...args) {
        j(u('cuberin://algs/' + args.join('-')))
    }
    function return_() {
        j(u('cuberin://algs'))
    }
    function isShowAll(i) {
        return showAlls.value[i]
    }
    function setShowAll(i) {
        showAlls.value[i] = ! showAlls.value[i]
    }
    const form_cube = [
        {
            name: $t('form_cube_name'),
            vname: 'name',
            type: 'text'
        },
        {
            name: $t('form_cube_x'),
            vname: 'x',
            type: 'number'
        }
    ]
    function addCube() {
        torture({
            list: form_cube,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_add_cube'),
                    data: { action: 'add', table: 'cubes', data: data }
                })
            }
        })
    }
    function editCube(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: form_cube,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_edit_cube'),
                    data: { action: 'edit', table: 'cubes', id: odata.id, data: data }
                })
            }
        })
    }
    function delCube(id) {
        confMsg({
            content: $t('question_confirm_to_delete'),
            callback_ok() {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_del_cube'),
                    data: { action: 'delete', table: 'cubes', id: id },
                    jump: return_
                })
            }
        })
    }
    const form_cube_alg_set = [
        {
            name: $t('form_cube_alg_set_name'),
            vname: 'name',
            type: 'text'
        },
        {
            name: $t('form_cube_alg_set_view') + $t('form_optional_tip'),
            vname: 'algs_view',
            type: 'select',
            appendConf: {
                inputOptions: [
                    { label: $t('alg_view_empty'), value: '' },
                    { label: $t('alg_view_trans'), value: 'trans' },
                    { label: $t('alg_view_plan'), value: 'plan' }
                ]
            }
        },
        {
            name: $t('form_cube_alg_set_stage') + $t('form_optional_tip'),
            vname: 'algs_stage',
            type: 'text'
        }
    ]
    function addAlgSet() {
        torture({
            list: form_cube_alg_set,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_add_cube_alg_set'),
                    data: { action: 'add', table: 'alg_sets', data: Object.assign(data, { cube_id: cube_id }) }
                })
            }
        })
    }
    function editAlgSet(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: form_cube_alg_set,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_edit_cube_alg_set'),
                    data: { action: 'edit', table: 'alg_sets', id: odata.id, data: data }
                })
            }
        })
    }
    function delAlgSet(id) {
        confMsg({
            content: $t('question_confirm_to_delete'),
            callback_ok() {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_del_cube_alg_set'),
                    data: { action: 'delete', table: 'alg_sets', id: id },
                    jump: return_
                })
            }
        })
    }
    const form_cube_alg = [
        {
            name: $t('form_cube_alg_name'),
            vname: 'name',
            type: 'text'
        },
        {
            name: $t('form_cube_fd') + $t('form_optional_tip'),
            vname: 'fd',
            type: 'text'
        }
    ]
    function addAlg() {
        torture({
            list: form_cube_alg,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_add_cube_alg'),
                    data: { action: 'add', table: 'algs', data: Object.assign(data, { set_id: alg_set_id }) }
                })
            }
        })
    }
    function editAlg(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: form_cube_alg,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_edit_cube_alg'),
                    data: { action: 'edit', table: 'algs', id: odata.id, data: data }
                })
            }
        })
    }
    function delAlg(id) {
        confMsg({
            content: $t('question_confirm_to_delete'),
            callback_ok() {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_del_cube_alg'),
                    data: { action: 'delete', table: 'algs', id: id }
                })
            }
        })
    }
    const form_cube_salg = [
        {
            name: $t('form_cube_salg_alg'),
            vname: 'alg',
            type: 'text'
        }
    ]
    function addSalg(alg_id) {
        torture({
            list: form_cube_salg,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_add_cube_salg'),
                    data: { action: 'add', table: 'salgs', data: Object.assign(data, { alg_id: alg_id }) }
                })
            }
        })
    }
    function editSalg(odata) {
        torture({
            isEdit: true,
            oldData: odata,
            list: form_cube_salg,
            next(data) {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_edit_cube_salg'),
                    data: { action: 'edit', table: 'salgs', id: odata.id, data: data }
                })
            }
        })
    }
    function delSalg(id) {
        confMsg({
            content: $t('question_confirm_to_delete'),
            callback_ok() {
                p({
                    url: u('local://api/cuberin/algs/admin'),
                    name: $t('api_del_cube_salg'),
                    data: { action: 'delete', table: 'salgs', id: id }
                })
            }
        })
    }
    
    await runThread(async () => await p({
        name: $t('api_sync_data'),
        url: u('local://api/cuberin/algs'),
        data: { alg_set_id: alg_set_id },
        on_ok(res) {
            adminUids.value = res.data.adminUids
            classes.value = res.data.classes
            algs.value = res.data.algs
        },
        type: 'loop'
    }))
</script>