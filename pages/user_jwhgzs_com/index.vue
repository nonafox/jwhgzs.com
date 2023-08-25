<script setup>
    definePageMeta({
        titles: [
            ['local://user', '用户中心'],
            ['', '主页']
        ]
    })
    
    if (process.client) {
        if (getCookie('userToken')) {
            j(u('local://user/ucenter'))
        } else {
            j(u('local://user/login'))
        }
    }
</script>