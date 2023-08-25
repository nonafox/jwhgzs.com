<template>
    <div class="quill_container" :class="{ quill_container_formstyle: formStyle }">
        <el-divider>{{ title }}</el-divider>
        <slot></slot>
    </div>
</template>

<script setup>
    defineProps(['title', 'formStyle'])
</script>