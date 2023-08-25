<style scoped>
    .avater-container {
        display: inline-flex;
        border-radius: 50%;
        overflow: hidden;
        justify-content: center;
        align-items: center;
    }
    .avatar {
        object-fit: cover;
    }
    .erricon {
        color: white;
    }
</style>

<template>
    <span class="imgAwesome avater-container"
            :style="{ width: a + 'px', height: a + 'px', 'background-color': err ? 'gray' : 'white' }">
        <el-image v-show="! err" class="avatar" :src="src" loading="lazy"
            :style="{ width: a + 'px', height: a + 'px' }" @error="err = true"></el-image>
        <i v-show="err" class="fas fa-user erricon" :style="{ 'font-size': a / 42 * 16 + 'px' }"></i>
    </span>
</template>

<script setup>
    let props = defineProps(['src', 'size'])
    let a = ref(props.size ? props.size : 42),
        err = ref(false)
</script>