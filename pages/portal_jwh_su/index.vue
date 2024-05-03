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
        word-break: break-word;
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
        <strong style="white-space: pre-wrap;">{{ $t('su_introduce') }}</strong>
        <div class="sub">
            {{ $t('su_thanks') }}
            <el-link type="primary" @click="j(u('sponsors://regery'), '_blank')">
                <img :src="u('static://public/img/sponsor_regery')" alt="Regery logo" class="logolink_bigger"/>
            </el-link>
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
            ['shortUrl://', 'page_title_shorturl'],
            ['', 'page_title_home']
        ],
        bgImg: 'static://public/img/bkg2',
        isntMainDomain: true
    })
</script>