<style scoped>
    .link {
        width: 100%;
        
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 0;
        overflow: hidden;
    }
    .carouselA {
        display: inline-block;
    }
    .carouselImgContainer {
        height: 240px;
    }
    .carouselImg {
        width: 100%;
        max-height: 90%;
    }
    .carouselTitle {
        width: 100%;
        color: #6E6E6E;
        text-align: center;
        font-size: 140%;
        font-weight: bold;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <el-skeleton :rows="5" :loading="! carouselList" animated>
            <template #default>
                <el-carousel v-if="carouselList" indicator-position="outside" arrow="always">
                    <el-carousel-item v-for="(v, k) in carouselList" style="text-align: center">
                        <custom-a target="_blank" :href="carouselUrl(v.id)" class="aAwesome carouselA">
                            <div class="carouselImgContainer"><img class="carouselImg" :alt="v.title + ' 论坛封面图'" :src="v.coverImg" style="object-fit: cover;"/></div>
                            <div class="carouselTitle">{{ v.title }}</div>
                        </custom-a>
                    </el-carousel-item>
                </el-carousel>
            </template>
        </el-skeleton>
        <el-divider></el-divider>
        <div class="box_title">{{ $t('subsite_navigation') }}</div>
        <br/>
        <custom-a :href="u('local://forum')">
            <img class="link" alt="论坛 banner" :src="u('static://public/img/link_forum')"/>
        </custom-a>
        <custom-a :href="u('local://xnzx')">
            <img class="link" alt="新宁空间 banner" :src="u('static://public/img/link_xnzx')"/>
        </custom-a>
        <custom-a :href="u('local://admin')">
            <img class="link" alt="后台管理 banner" :src="u('static://public/img/link_admin')"/>
        </custom-a>
        <custom-a :href="u('shortUrl://')">
            <img class="link" alt="短链接 banner" :src="u('static://public/img/link_shortUrl')"/>
        </custom-a>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        /* cant use u() here because definePageMeta() hasnt a Nust context
           (it was just my opinion. in fact, definePageMeta() is a macro function... you konw ?)
           that means we cant use useState(), useXxx() etc
           i blocked here for several hours... just because i find a wrong bug
           (i thought this is because the config json fetching hasnt done at that time !)
           */
        titles: [
            ['local://www', 'page_title_main'],
            ['', 'page_title_home']
        ]
    })
    
    // -- refs
    let carouselList = ref(null)
    
    // -- app
    function carouselUrl(id) {
        return u('local://forum/detail') + '/' + id
    }
    
    await runThread(async () => await p({
        name: $t('api_sync_data'),
        url: u('local://api/www'),
        on_ok(res) {
            carouselList.value = res.data.carouselList
        },
        type: 'loop'
    }))
</script>