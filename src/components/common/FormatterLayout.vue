<template>
    <div class="formatter">
        <div class="input-container">
            <a-textarea v-model:value="input" :placeholder="'请输入 ' + lang + ' 文本'" allowClear :rows="25"
                ref="inputRef" />
        </div>
        <div class="output-container" @mouseover=" showCopy = isSupported && !showCopied"
            @mouseleave="showCopy = false">
            <div class="output">
                <slot :formatted="formatted"></slot>
            </div>
            <a v-if="showCopy" @click="onCopy()">
                <CopyOutlined />
            </a>
            <a v-if="showCopied" class="success">
                <CheckOutlined />
            </a>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
    lang: String,
})

const input = ref('')
const inputRef = ref(null)
const formatted = ref('')
const output = ref('')

const showCopy = ref(false)
const showCopied = ref(false)

onMounted(() => {
    inputRef.value.focus()
})

const { copy, isSupported } = useClipboard({ output })

watch(input, (newValue) => {
    switch (props.lang) {
        case 'json':
            try {
                formatted.value = JSON.parse(newValue)
            } catch (e) {
                formatted.value = { error: `无效的 ${props.lang}` }
            }
            output.value = JSON.stringify(formatted.value, null, 2)
            break
        case 'sql':
            Promise.all([
                import('sql-formatter'),
                import('highlight.js/lib/core'),
                import('highlight.js/lib/languages/sql'),])
                .then(([{ format }, hljs, sql]) => {
                    const temp = format(newValue)
                    hljs.default.registerLanguage('sql', sql.default)
                    formatted.value = hljs.default.highlight(temp, { language: 'sql' }).value
                    output.value = temp
                })
            break
        default:
            formatted.value = { error: `不支持的 ${props.lang}` }
    }
})

const onCopy = () => {
    copy(output.value)
    showCopied.value = true
    setTimeout(() => {
        showCopied.value = false
    }, 2000)
}

</script>

<style scoped lang="less">
.formatter {
    display: flex;
    gap: 20px;

    .input-container,
    .output-container {
        display: flex;
        flex-direction: column;
        width: 50%;
        position: relative;
    }

    .output {
        height: 560px;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f5f5f5;
        overflow: auto;
    }

    .output-container a {
        position: absolute;
        top: 4px;
        right: 6px;
        color: rgba(0, 0, 0, 0.45);

        &:hover {
            color: rgba(0, 0, 0, 0.6);
        }
    }

    .output-container .success {
        color: #53ce15;

        &:hover {
            color: #53ce15;
        }
    }
}
</style>