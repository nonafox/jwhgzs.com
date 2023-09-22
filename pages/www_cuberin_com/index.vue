<style scoped>
    .logo {
        width: 20rem;
        max-width: 80%;
        margin-left: -1.5rem;
    }
    p {
        margin-top: 0.6rem;
        line-height: 150%;
        color: gray;
    }
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
    }
    .link.disabled>* {
        color: #ccc;
    }
    .arrow {
        width: 100%;
        text-align: right;
        color: #ccc;
        font-size: 300%;
    }
    .hover:hover {
        border: 1px solid #409EFF;
        color: #409EFF;
        transition: all .3s;
    }
</style>

<template>
    <div class="box box_md hcenter">
        <img :src="u('static://public/img/cuberin_logo')" class="logo"/>
        <div class="box_graytitle" style="margin-left: 0.6rem;">{{ $t('for_all_the_cubers') }}</div>
        <el-divider></el-divider>
        <p>
            We all know what happened recently. I have to say, it is a pity that <el-link type="primary" @click="j(u('speedcubedb://'), '_blank')">speedcubedb.com</el-link> is gone, that is the thing lots of cubers depend on. Instead of missing it for a long time, I made the website and hope it lives more.
        </p>
        <p>
            由于一些众所周知的原因，<el-link type="primary" @click="j(u('speedcubedb://'), '_blank')">speedcubedb.com</el-link> 已经永久关停。为了我和各位魔友们能继续玩得快乐，我搭建了这个网站以取代它。也希望本网站能活得更久！
        </p>
    </div>
    <div class="box box_md hcenter" style="margin-top: 20px;">
        <div class="link hover" style="margin-top: 0 !important;" @click="j(u('cuberin://algs'))">
            <span class="box_title">公式</span>
            <span class="box_graytitle">Algorithms</span>
            <div class="arrow">&gt;</div>
        </div>
        <div class="link hover disabled">
            <span class="box_title">教程</span>
            <span class="box_graytitle">Tutorial</span>
            <div class="arrow">&gt;</div>
        </div>
        <div class="link hover disabled">
            <span class="box_title">练习</span>
            <span class="box_graytitle">Training</span>
            <div class="arrow">&gt;</div>
        </div>
        <div class="link hover disabled">
            <span class="box_title">复盘</span>
            <span class="box_graytitle">Review</span>
            <div class="arrow">&gt;</div>
        </div>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['cuberin://', 'page_title_cuberin'],
            ['', 'page_title_home']
        ],
        isntMainDomain: true,
        logo_img: 'static://public/img/cuberin_logo',
        logo_link: 'cuberin://'
    })
    
    // -- refs
    
    
    // -- app
    
</script>