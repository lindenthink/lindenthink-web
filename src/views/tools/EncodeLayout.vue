<template>
  <a-row :gutter="24">
    <!-- 左侧操作区 -->
    <a-col :span="12">
      <a-card :title="`${currentEncoder.name} 编解码`">
        <div class="config-bar">
          <a-radio-group v-model:value="mode" button-style="solid" @change="handleModeChange">
            <a-radio-button value="encode">编码</a-radio-button>
            <a-radio-button value="decode">解码</a-radio-button>
          </a-radio-group>
        </div>

        <a-textarea
          v-model:value="inputText"
          :placeholder="mode === 'encode' ? currentEncoder.encodePlaceholder : currentEncoder.decodePlaceholder"
          :auto-size="{ minRows: 8, maxRows: 12 }"
          allow-clear
          class="input-area"
        />

        <a-button type="primary" block size="large" :loading="converting" @click="handleConvert">
          <template #icon>
            <swap-outlined :rotate="90" />
          </template>
          {{ mode === 'encode' ? '执行编码' : '执行解码' }}
        </a-button>
      </a-card>
    </a-col>

    <!-- 右侧结果区 -->
    <a-col :span="12">
      <a-card title="处理结果">
        <div class="result-container">
          <a-textarea
            v-model:value="outputText"
            :placeholder="mode === 'encode' ? currentEncoder.resultLabel : currentEncoder.decodeResultLabel"
            :auto-size="{ minRows: 8, maxRows: 12 }"
            readonly
            class="result-area"
          />
          <div class="copy-button-wrapper">
            <a-tooltip title="复制结果">
              <a-button type="link" :disabled="!outputText" class="copy-btn" @click="copyResult">
                <copy-outlined />
              </a-button>
            </a-tooltip>
          </div>
        </div>

        <div class="action-bar">
          <a-tag :color="resultStatus.color">
            {{ resultStatus.text }}
          </a-tag>
          <a-tag color="blue"> 结果长度: {{ outputText.length }} </a-tag>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { SwapOutlined, CopyOutlined } from '@ant-design/icons-vue'

// 编码器配置
const encoders = {
  base64: {
    name: 'Base64',
    encode: (str) => {
      try {
        return btoa(
          new Uint8Array(new TextEncoder().encode(str)).reduce((data, byte) => data + String.fromCharCode(byte), ''),
        )
      } catch (error) {
        throw new Error(`编码失败: ${error.message}`)
      }
    },
    decode: (str) => {
      try {
        return new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)))
      } catch (error) {
        throw new Error(`解码失败: ${error.message}`)
      }
    },
    encodePlaceholder: '输入要编码的文本',
    decodePlaceholder: '输入Base64字符串',
    resultLabel: 'Base64编码结果',
    decodeResultLabel: '解码后文本',
  },
  url: {
    name: 'URL',
    encode: encodeURIComponent,
    decode: decodeURIComponent,
    encodePlaceholder: '输入要URL编码的文本',
    decodePlaceholder: '输入URL编码字符串',
    resultLabel: 'URL编码结果',
    decodeResultLabel: '解码后文本',
  },
  unicode: {
    name: 'Unicode',
    encode: (str) => {
      return str
        .split('')
        .map((c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
        .join('')
    },
    decode: (str) => {
      return str.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)))
    },
    encodePlaceholder: '输入要转Unicode的文本',
    decodePlaceholder: '输入Unicode转义序列（如\\u4f60\\u597d）',
    resultLabel: 'Unicode转义结果',
    decodeResultLabel: '解码后文本',
  },
  ascii: {
    name: 'ASCII',
    encode: (str) => {
      return str
        .split('')
        .map((c) => {
          const code = c.charCodeAt(0)
          if (code > 127) throw new Error('非ASCII字符')
          return code.toString(16).padStart(2, '0')
        })
        .join(' ')
    },
    decode: (str) => {
      return str
        .split(' ')
        .map((hex) => String.fromCharCode(parseInt(hex, 16)))
        .join('')
    },
    encodePlaceholder: '输入ASCII文本（仅支持0-127字符）',
    decodePlaceholder: '输入十六进制ASCII码（如 48 65 6c 6c 6f）',
    resultLabel: 'ASCII十六进制',
    decodeResultLabel: '解码后文本',
  },
}
const props = defineProps({
  type: String,
})
// 响应式状态
const currentType = ref(props.type)
const currentEncoder = computed(() => encoders[currentType.value])
const mode = ref('encode')
const inputText = ref('')
const outputText = ref('')
const converting = ref(false)

// 状态计算
const resultStatus = computed(() => {
  if (!outputText.value) return { text: '等待输入', color: 'gray' }
  if (outputText.value.startsWith('⚠')) return { text: '错误', color: 'red' }
  return { text: '有效结果', color: 'green' }
})

// 事件处理
const handleConvert = async () => {
  try {
    converting.value = true
    const processor = mode.value === 'encode' ? currentEncoder.value.encode : currentEncoder.value.decode
    outputText.value = processor(inputText.value)
  } catch (error) {
    outputText.value = `⚠ 错误: ${error.message}`
    message.error(`处理失败: ${error.message}`)
  } finally {
    converting.value = false
  }
}

const handleModeChange = () => {
  ;[inputText.value, outputText.value] = [outputText.value, inputText.value]
}

const copyResult = () => {
  navigator.clipboard
    .writeText(outputText.value)
    .then(() => message.success('复制成功'))
    .catch(() => message.error('复制失败'))
}
</script>

<style scoped>
.config-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.input-area,
.result-area {
  font-family: 'Fira Code', monospace;
  margin: 16px 0;
}

.ant-btn-block {
  height: 48px;
  font-size: 16px;
}

.result-container {
  position: relative;
}

.copy-button-wrapper {
  position: absolute;
  top: 15px;
  right: 2px;
  z-index: 1;
}

.copy-btn {
  color: #1890ff;
  font-size: 16px;
  padding: 4px;
}

.action-bar {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .config-bar {
    flex-direction: column;
  }

  .ant-col-12 {
    width: 100%;
    margin-bottom: 24px;
  }
}
</style>
