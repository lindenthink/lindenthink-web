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
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="24">
          <a-select v-model:value="diffMode" style="width: 200px" @change="handleInput">
            <a-select-option value="line">行级对比</a-select-option>
            <a-select-option value="char">字符级对比</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <div class="diff-container">
        <a-row :gutter="16">
          <!-- 字符模式合并展示 -->
          <a-col v-if="diffMode === 'char'" :span="24">
            <div class="diff-panel combined-mode">
              <pre class="diff-content combined-content" v-html="diffResult.combined"></pre>
            </div>
          </a-col>
          <template v-else>
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
          </template>
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
const diffMode = ref('char') // line | char

// 计算行号
const leftLineNumbers = computed(() => generateLineNumbers(diffResult.value?.left || ''))
const rightLineNumbers = computed(() => generateLineNumbers(diffResult.value?.right || ''))

// 行号生成逻辑
const generateLineNumbers = (html) => {
  const isCharMode = diffMode.value === 'char'
  if (isCharMode) return [] // 字符模式不显示行号

  const lineCount = (html.match(/<div/g) || []).length
  return Array.from({ length: lineCount }, (_, i) => i + 1)
}

const compareText = () => {
  let diff
  if (diffMode.value === 'char') {
    diff = Diff.diffChars(textLeft.value, textRight.value)
  } else {
    diff = Diff.diffLines(textLeft.value, textRight.value)
  }
  const isCharMode = diffMode.value === 'char'
  const leftHtml = []
  const rightHtml = []
  const combinedHtml = []

  diff.forEach((part) => {
    const content = isCharMode ? part.value : part.value.split('\n').filter((l) => l !== '')
    const color = part.added ? '#e6ffe6' : part.removed ? '#ffe6e6' : 'transparent'
    const textColor = part.added ? '#389e0d' : part.removed ? '#cf1322' : 'inherit'

    if (isCharMode) {
      // 合并模式处理逻辑
      const symbol = part.added ? '+' : part.removed ? '-' : ''
      combinedHtml.push(
        `<span class="diff-char" style="background:${color};color:${textColor}">` +
          `${symbol}${part.value}` +
          '</span>',
      )
    } else {
      const process = (item) => {
        return `<div style="background: ${color}">${item}</div>`
      }

      content.forEach((item) => {
        if (part.removed || !part.added) {
          leftHtml.push(process(item))
        }
        if (part.added || !part.removed) {
          rightHtml.push(process(item))
        }
      })
    }
  })

  if (isCharMode) {
    diffResult.value = {
      combined: combinedHtml.join(''),
    }
  } else {
    diffResult.value = {
      left: leftHtml.join(''),
      right: rightHtml.join(''),
    }
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
.input-card {
  margin-bottom: 20px;
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
}

/* 合并模式样式 */
.combined-mode {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;

  .combined-content {
    font-family: Monaco, Consolas, monospace;
    white-space: pre-wrap;
    line-height: 1.8;
  }

  .diff-char {
    display: inline-block;
    margin: 0 2px;
    padding: 0 2px;
    border-radius: 2px;
    position: relative;
  }
}
</style>
