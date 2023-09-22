<style scoped>
    .link {
        width: 100%;
        margin: 10px 0 !important;
        --el-button-size: 80px;
        font-size: 150%;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <div class="box_title">后台管理</div>
        <el-divider></el-divider>
        <el-button class="link btns2" text round bg size="large" @click="j(u('local://admin/xnzx'))">新宁空间管理</el-button>
        <el-button class="link btns2" text round bg size="large" @click="j(u('local://admin/shortUrl'))">短链接管理</el-button>
    </div>
</template>

<script setup>
    definePageMeta({
        titles: [
            ['local://admin', '后台管理'],
            ['', '主页']
        ],
        mustLogin: true
    })
</script>