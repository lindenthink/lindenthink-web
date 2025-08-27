<template>
  <a-row :gutter="24">
    <a-col :span="12">
      <a-card :title="lang.toUpperCase() + '格式化'" class="form-card">
        <a-textarea
          ref="inputRef"
          v-model:value="input"
          :placeholder="'请输入 ' + lang + ' 文本'"
          allow-clear
          :rows="15"
          class="code-area"
        />
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card title="格式化内容" class="form-card">
        <div class="output-wrapper" @mouseover="showCopy = isSupported && !showCopied" @mouseleave="showCopy = false">
          <pre class="code-output"><code><slot :formatted="formatted"></slot></code></pre>
          <div class="copy-wrapper">
            <a-tooltip title="复制结果">
              <a v-if="showCopy" class="copy-btn" @click="onCopy()">
                <CopyOutlined />
              </a>
            </a-tooltip>
            <a-tooltip v-if="showCopied" title="已复制">
              <CheckOutlined class="success-icon" />
            </a-tooltip>
          </div>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import useFormat from '@/composables/useFormat'

const props = defineProps({
  lang: String,
})

const input = ref('')
const inputRef = ref(null)
const { formatted, output, highlight } = useFormat()

const showCopy = ref(false)
const showCopied = ref(false)

onMounted(() => {
  inputRef.value.focus()
})

const { copy, isSupported } = useClipboard({ source: output })

watch(input, (newValue) => {
  highlight(newValue, props.lang)
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
.form-card {
  height: auto;
  border-radius: 2px;

  :deep(.ant-card-head) {
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }

  .breadcrumb {
    margin-bottom: 16px;
  }
}

.code-area {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  resize: none;
}

.output-wrapper {
  position: relative;

  .code-output {
    min-height: 340px;
    max-height: 500px;
    margin: 0;
    padding: 12px;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: auto;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.6;
  }

  .copy-wrapper {
    position: absolute;
    top: 16px;
    right: 16px;

    .copy-btn {
      color: rgba(0, 0, 0, 0.45);
      transition: all 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .success-icon {
      color: #52c41a;
    }
  }
}
</style>
