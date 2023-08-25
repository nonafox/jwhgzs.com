<template>
    <avatar :src="makeAvatarUrl(udata)" :size="size"></avatar>
</template>

<script setup>
    defineProps(['udata', 'size'])
</script>