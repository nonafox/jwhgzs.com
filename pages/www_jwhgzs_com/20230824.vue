<style scoped>
    .banner {
        width: 100%;
        padding: 20px;
        font-size: 120%;
        color: gray;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <div class="box_title">临时页 - 2023/8/24</div>
        <el-divider></el-divider>
        <div class="banner">
            <el-button v-if="! started" @click="doit">Start</el-button>
            <template v-else>
                <span v-if="i < count">进度：{{ i }} / {{ count }}（{{ (i / count * 100).toFixed(0) }} %）</span>
                <span v-else>已完成！</span>
            </template>
        </div>
        <el-table :data="list" max-height="500">
            <el-table-column prop="name" label="域名"></el-table-column>
            <el-table-column prop="" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.result ? 'success' : 'danger'">
                        {{ scope.row.result || 'NO' }}
                    </el-tag>
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
            ['local://www', '主站'],
            ['', '临时页']
        ]
    })
    
    // -- refs
    let started = ref(false),
        list = ref([]),
        i = ref(- 1),
        count = ref(0)
    
    // -- app
    const doit = async () => {
        started.value = true
        const url = u('local://api/tmp/prosi') + '?url=https://whois.tcinet.ru/domain/', suffix = '.su'
        let list0 = []
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        for (let j = 0; j < chars.length; j ++) {
            for (let k = 0; k < chars.length; k ++) {
                list0.push(chars[j] + chars[k] + suffix)
            }
        }
        count.value = list0.length
        for (i.value = 0; i.value < list0.length; i.value ++) {
            let a = i.value, v = list0[a]
            let res = await useFetch(url + '&data=' + encodeURIComponent('dmn=' + v), {
                method: 'POST'
            })
            if (res.status.value == 'success') {
                res = res.data.value
                if (res.startsWith('domain:')) {
                    if (res.indexOf('nserver:       ns1.expired.active.domains.') >= 0)
                        list.value.splice(0, 0, { name: v, result: 'Nearly OK' })
                    else
                        list.value.push({ name: v, result: '' })
                }
                else {
                    list.value.splice(0, 0, { name: v, result: 'OK' })
                }
            }
            else {
                errMsg('艹！出错了')
                break
            }
        }
    }
</script>