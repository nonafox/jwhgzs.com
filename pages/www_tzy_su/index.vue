<style scoped>
    .my_box {
        overflow: hidden;
        padding: 0;
        border-radius: 10px 10px 10px 10px;
    }
    .banner {
        width: 100%;
    }
    .links_box {
        width: calc(100% - 35px * 2);
        padding: 35px;
        display: flex;
        flex-flow: row wrap;
        column-count: 2;
        justify-content: space-between;
        row-gap: 10px;
    }
    .link {
        flex-basis: 48%;
        cursor: pointer;
    }
</style>

<template>
    <div class="box box_md hcenter my_box">
        <img class="banner" alt="F4 banner" :src="u('static://public/img/tzy_banner')"/>
        <br/>
        <div class="links_box">
            <img class="link" alt="memories banner" :src="u('static://public/img/tzy_memories')" @click="go('other://doc_memories')"/>
            <img class="link" alt="bible banner" :src="u('static://public/img/tzy_bible')" @click="go('other://doc_bible')"/>
            <img class="link" alt="cards banner" :src="u('static://public/img/tzy_cards')" @click="go('other://doc_cards')"/>
        </div>
    </div>
</template>

<script setup>
    // -- basics
    let config = useState('config')
    definePageMeta({
        titles: [
            ['tzy://', '谭镇洋主页'],
            ['', 'page_title_home']
        ],
        isntMainDomain: true
    })
    
    // -- refs
    
    // -- app
    function go(url) {
        j(u(url), '_blank')
    }
</script>