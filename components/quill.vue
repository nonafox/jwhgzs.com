<template>
    <div :id="quill_id" class="quill"></div>
</template>

<script setup>
    let props = defineProps(['modelValue'])
    let emit = defineEmits(['update:modelValue', 'input'])
    
    let quill = null,
        quill_dom = null,
        quill_id = ref('quill_' + random())
    
    onMounted(() => {
        /* quill配置参考：https://www.jianshu.com/p/b237372f15cc */
        quill = new Quill('#' + quill_id.value, {
            modules: {
                toolbar: {
                    container: [
                        [{ 'size': ['small', 'large', 'huge', false] }],
                        
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        
                        ['clean']
                    ],
                    handlers: {
                        mylink() {
                            quill.insertEmbed()
                        }
                    }
                }
            },
            theme: 'snow'
        })
        quill_dom = document.getElementById(quill_id.value).firstChild
        quill.on('text-change', function() {
            let ncontent = quill_dom.innerHTML
            emit('update:modelValue', ncontent)
            emit('input')
        })
    })
    watch(() => props.modelValue, () => {
        if (! process.client) return
        
        // 防止不是用户输入改变quill本身内容触发（自建的v-model导致）的，否则会导致用户输入不了
        let ncontent = quill_dom.innerHTML
        if (props.modelValue == ncontent) return
        quill_dom.innerHTML = props.modelValue
    })
</script>