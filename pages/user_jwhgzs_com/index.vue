<script setup>
    definePageMeta({
        titles: [
            ['local://user', 'page_title_ucenter'],
            ['', 'page_title_home']
        ]
    })
    
    if (import.meta.client) {
        if (getCookie('userToken')) {
            j(u('local://user/ucenter'))
        } else {
            j(u('local://user/login'))
        }
    }
</script>