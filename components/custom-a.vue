<template>
    <a :href="href" @click.prevent="triggerJump"><slot></slot></a>
</template>

<script setup>
    let props = defineProps(['href', 'target'])
    const triggerJump = () => props.href && j(props.href, props.target)
</script>