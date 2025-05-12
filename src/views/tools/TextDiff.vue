<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="text-diff-container">
    <a-row :gutter="16">
      <!-- 输入卡片 -->
      <a-col :span="12">
        <a-card title="原始文本" class="input-card">
          <a-textarea
            v-model:value="textLeft"
            placeholder="输入或粘贴文本1"
            :rows="12"
            allow-clear
            @input="handleInput"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="对比文本" class="input-card">
          <a-textarea
            v-model:value="textRight"
            placeholder="输入或粘贴文本2"
            :rows="12"
            allow-clear
            @input="handleInput"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 差异结果卡片 -->
    <a-card v-if="diffResult" class="diff-card">
      <div class="diff-container">
        <a-row :gutter="16">
          <!-- 左侧带行号 -->
          <a-col :span="12">
            <div class="diff-panel">
              <div class="line-numbers">
                <div v-for="num in leftLineNumbers" :key="'left-' + num">{{ num }}</div>
              </div>
              <pre class="diff-content diff-left" v-html="diffResult.left"></pre>
            </div>
          </a-col>

          <!-- 右侧带行号 -->
          <a-col :span="12">
            <div class="diff-panel">
              <div class="line-numbers">
                <div v-for="num in rightLineNumbers" :key="'right-' + num">{{ num }}</div>
              </div>
              <pre class="diff-content diff-right" v-html="diffResult.right"></pre>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as Diff from 'diff'

const textLeft = ref('')
const textRight = ref('')
const diffResult = ref(null)

// 计算行号
const leftLineNumbers = computed(() => generateLineNumbers(diffResult.value?.left || ''))
const rightLineNumbers = computed(() => generateLineNumbers(diffResult.value?.right || ''))

const generateLineNumbers = (html) => {
  const lineCount = (html.match(/<div/g) || []).length
  return Array.from({ length: lineCount }, (_, i) => i + 1)
}

// 带防抖的对比函数
const compareText = () => {
  const diff = Diff.diffLines(textLeft.value, textRight.value)
  const leftHtml = []
  const rightHtml = []

  diff.forEach((part) => {
    const lines = part.value.split('\n').filter((l) => l !== '')
    const color = part.added ? 'background: #e6ffe6' : part.removed ? 'background: #ffe6e6' : ''

    lines.forEach((line) => {
      const lineHtml = `<div style="${color}">${line}</div>`
      if (part.removed || !part.added) leftHtml.push(lineHtml)
      if (part.added || !part.removed) rightHtml.push(lineHtml)
    })
  })

  diffResult.value = {
    left: leftHtml.join(''),
    right: rightHtml.join(''),
  }
}

// 防抖处理（500ms）
let timeoutId = null
const handleInput = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(compareText, 500)
}
</script>

<style scoped>
.text-diff-container {
  max-width: 1400px;
  margin: 20px auto;
  padding: 20px;
}

.input-card {
  margin-bottom: 20px;

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.diff-card {
  :deep(.ant-card-body) {
    padding: 0;
  }
}

.diff-container {
  .diff-panel {
    display: flex;
    position: relative;
    font-family: Monaco, Consolas, monospace;
  }

  .line-numbers {
    padding: 10px 8px;
    background: #f8f8f8;
    border-right: 1px solid #e8e8e8;
    color: #999;
    text-align: right;
    user-select: none;

    div {
      padding: 2px 4px;
      line-height: 1.5;
    }
  }

  .diff-content {
    flex: 1;
    padding: 10px;
    margin: 0;
    white-space: pre-wrap;

    div {
      padding: 2px 4px;
      line-height: 1.5;
      min-height: 20px;
    }
  }

  .diff-left div[style*='background: #ffe6e6'],
  .diff-right div[style*='background: #e6ffe6'] {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--line-color);
    }
  }

  .diff-left div[style*='background: #ffe6e6']::before {
    --line-color: #ffccc7;
  }

  .diff-right div[style*='background: #e6ffe6']::before {
    --line-color: #b7eb8f;
  }
}
</style>
