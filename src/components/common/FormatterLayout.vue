<template>
    <div class="formatter">
        <div class="input-container">
            <a-textarea v-model:value="input" :placeholder="'请输入 ' + lang + ' 字符串'" allowClear :rows="25" />
        </div>
        <div class="output-container" @mouseover="showCopyButton = !showCopied" @mouseleave="showCopyButton = false">
            <div class="output">
                <slot :formatted="formatted"></slot>
            </div>
            <a v-if="showCopyButton" @click="onCopy">
                <CopyOutlined />
            </a>
            <a v-if="showCopied" class="success">
                <CheckOutlined />
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    lang: String,
})

const input = ref('')
const formatted = ref('')
const showCopyButton = ref(false)
const showCopied = ref(false)


watch(input, (newValue) => {
    try {
        formatted.value = JSON.parse(newValue)
    } catch (e) {
        formatted.value = { error: `无效的 ${props.lang}` }
    }
})

const onCopy = () => {
    const output = JSON.stringify(formatted.value, null, 2)
    navigator.clipboard.writeText(output).then(() => {
        showCopyButton.value = false
        showCopied.value = true
        setTimeout(() => {
            showCopied.value = false
        }, 2000)
    }).catch(err => {
        message.error('复制失败')
    })
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