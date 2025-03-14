<template>
    <div class="format-json">
        <div class="input-container">
            <a-textarea v-model:value="inputJson" placeholder="输入 JSON 字符串" allowClear :rows="25" />
        </div>
        <div class="output-container" @mouseover="showCopyButton = !showCopied" @mouseleave="showCopyButton = false">
            <div class="json-output">
                <vue-json-pretty :data="formattedJson" :deep="1" :showIcon="true" />
            </div>
            <a v-if="showCopyButton" @click="copyOutput">
                <CopyOutlined />
            </a>
            <a v-if="showCopied" class="success" prevent>
                <CheckOutlined />
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { message } from 'ant-design-vue'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'

const inputJson = ref('')
const formattedJson = ref('')
const showCopyButton = ref(false)
const showCopied = ref(false)

watch(inputJson, (newValue) => {
    try {
        formattedJson.value = JSON.parse(newValue)
    } catch (e) {
        formattedJson.value = { error: '无效的 JSON' }
    }
})

const copyOutput = () => {
    const output = JSON.stringify(formattedJson.value, null, 2)
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
.format-json {
    display: flex;
    gap: 20px;
}

.input-container,
.output-container {
    display: flex;
    flex-direction: column;
    width: 50%;
    position: relative;
}

.json-output {
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
</style>