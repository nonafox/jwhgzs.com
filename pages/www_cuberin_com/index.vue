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