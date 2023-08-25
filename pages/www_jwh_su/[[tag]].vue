<style scoped>
    .text {
        border: none;
        margin-bottom: 30px;
        width: 50rem;
        max-width: 80%;
        z-index: 2;
        padding: 20px;
        
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 170%;
        color: white;
        text-align: center;
        word-break: break-all;
    }
    .para {
        font-size: unset !important;
        text-align: unset !important;
        word-break: unset !important;
    }
    .sub {
        font-size: 60%;
        margin-top: 20px;
    }
    .block {
        width: 100%;
        height: 100vh;
    }
    .quot {
        height: 2rem;
    }
</style>

<template>
    <div class="box hcenter text">
        本域名为稀有的 .su 苏联国别域名。
        <div class="sub">
            感谢注册商
            <el-link type="primary" @click="j(u('sponsors://regery'), '_blank')">
                <img :src="u('static://public/img/sponsor_regery')" alt="Regery logo" class="logolink_bigger"/>
            </el-link>
            ！
        </div>
    </div>
    <div class="box hcenter text para">
        <p>
            <img :src="u('static://public/img/comp_lquot_white')" alt="left quot" class="quot imgAwesome"/>
            Sadly though now and contrary to what I have previously written where the TLD previously represented a kind of Soviet nostalgia, now it is more linked to Russian nationalism and what might actually become a reality – Soviet Union 2.0.
        </p>
        <p style="text-indent: 2rem;">
            After all we already have a new Cold War.
            <img :src="u('static://public/img/comp_rquot_white')" alt="right quot" class="quot imgAwesome"/>
        </p>
        <p>
            ——
            <el-link type="primary" @click="j(u('other://whatIsSu'), '_blank')" style="margin-left: 10px;">
                {{ u('other://whatIsSu') }}
            </el-link>
        </p>
    </div>
    <div class="block"></div>
</template>

<script setup>
    definePageMeta({
        titles: [
            ['shortUrl://', '短链接'],
            ['', '主页']
        ],
        bgImg: 'static://public/img/bkg2',
        isntMainDomain: true
    })
    
    let tag = getRouteParam('tag')
    if (process.client && tag) {
        p({
            name: '短链接跳转',
            url: u('local://api/shortUrl'),
            data: { tag: tag },
            on_ok(data) {
                j(data.data.url)
            },
            type: 'money'
        })
    }
</script>