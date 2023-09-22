<style scoped>
    .uname {
        color: gray;
    }
    .time {
        color: gray;
        font-size: 80%;
    }
</style>

<template>
    <!-- 这里不给100%会导致有时（如论坛详情页）因为上面float的btns而压缩了宽度 -->
    <el-row style="width: 100%;">
        <el-col :span="-1" style="margin-right: 10px;">
            <custom-a class="aAwesome" target="_blank" :href="u('local://user/ucenter') + '/' + udata.id">
                <user-avatar :udata="udata"></user-avatar>
            </custom-a>
        </el-col>
        <el-col :span="-1" :class="{ vcenter: (single ? true : false) }">
            <custom-a class="aAwesome" target="_blank" :href="u('local://user/ucenter') + '/' + udata.id">
                <span v-if="! udata.name" style="font-size: 80%; color: gray;">
                    <i class="fas fa-spinner rotate"></i>
                    加载中……
                </span>
                <span class="uname" :class="{ authed_uname: (udata.userGroup || udata.userAuth) }">
                    {{ udata.name }}
                </span>
                <template v-for="(v, k) in udata.userTags[1]">
                    <el-tag v-if="k < 2" style="margin-left: 5px;" type="success" size="small">
                        {{ $t(v) }}
                    </el-tag>
                </template>
            </custom-a>
            <div v-if="time" class="time">{{ getTimeDesc(time) }}</div>
        </el-col>
    </el-row>
</template>

<script setup>
    defineProps(['udata', 'time', 'single'])
</script>