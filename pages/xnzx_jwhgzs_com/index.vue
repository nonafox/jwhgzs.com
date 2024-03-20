<style scoped>
</style>

<template>
    <div class="box box_md hcenter">
        <div class="box_title">新宁空间</div>
        <custom-a :href="u('local://xnzx/PA')">
            <img class="link" alt="新宁空间 纪念册banner" :src="u('static://public/img/link_xnzx_PA')"/>
        </custom-a>
        <custom-a :href="u('local://xnzx/weekly')">
            <img class="link" alt="新宁空间 班级周报banner" :src="u('static://public/img/link_xnzx_weekly')"/>
        </custom-a>
        <custom-a :href="u('local://xfcl')">
            <img class="link" alt="新宁足球冠军联赛 banner" :src="u('static://public/img/link_xfcl')"/>
        </custom-a>
    </div>
</template>

<script setup>
    definePageMeta({
        titles: [
            ['local://xnzx', '新宁空间'],
            ['', '主页']
        ]
    })
</script>