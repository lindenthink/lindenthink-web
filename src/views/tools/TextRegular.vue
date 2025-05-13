<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="regular-container">
    <a-card title="正则表达式" class="input-card">
      <a-space direction="vertical" style="width: 100%">
        <!-- 正则表达式输入 -->
        <a-input-group compact>
          <a-select v-model:value="regexFlags" style="width: 360px" mode="multiple">
            <a-select-option value="g">全局匹配(g)</a-select-option>
            <a-select-option value="i">忽略大小写(i)</a-select-option>
            <a-select-option value="m">多行模式(m)</a-select-option>
          </a-select>
          <a-input
            v-model:value="regexPattern"
            placeholder="输入正则表达式，例如：\d+"
            allow-clear
            style="width: calc(100% - 360px)"
          />
        </a-input-group>

        <!-- 快捷正则 -->
        <div class="quick-regex">
          <a-button v-for="item in commonRegex" :key="item.name" size="small" @click="selectRegex(item)">
            {{ item.name }}
          </a-button>
        </div>

        <!-- 测试文本输入 -->
        <a-textarea v-model:value="testText" placeholder="输入测试文本" :rows="2" allow-clear />

        <!-- 匹配结果 -->
        <a-card title="匹配结果" class="result-card">
          <div v-if="error" class="error">{{ error }}</div>
          <div v-else-if="matches.length === 0">无匹配结果</div>
          <div v-else class="highlight-text" v-html="highlightText"></div>
        </a-card>

        <!-- 正则语法参考 -->
        <a-collapse>
          <a-collapse-panel key="1" header="正则语法速查">
            <div class="regex-reference">
              <a-table
                :columns="[
                  { title: '语法', dataIndex: 'syntax' },
                  { title: '说明', dataIndex: 'desc' },
                ]"
                :data-source="regexSyntax"
                size="small"
                :pagination="false"
              />
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const regexPattern = ref('\\d+')
const regexFlags = ref(['g'])
const testText = ref('')
const matches = ref([])
const error = ref('')
const highlightText = ref('')

watchEffect(() => {
  try {
    error.value = ''
    if (!regexPattern.value) {
      matches.value = []
      highlightText.value = testText.value
      return
    }

    const regex = new RegExp(regexPattern.value, regexFlags.value.join(''))
    const newMatches = [...testText.value.matchAll(regex)] || []

    // 更新匹配结果
    matches.value = newMatches

    // 更新高亮文本
    // highlightText.value = testText.value.replace(
    //   regex,
    //   '<span style="background-color: #fffbe6;padding: 2px 4px;border-radius: 2px;border: 1px solid #ffe58f;">$&</span>',
    // )
    highlightText.value = testText.value.replace(regex, '<span class="highlight">$&</span>')
  } catch (e) {
    error.value = e.message
    matches.value = []
    highlightText.value = testText.value
  }
})

// 常用正则表达式
const commonRegex = ref([
  {
    name: '手机号',
    pattern: '^1[3-9]\\d{9}$',
    desc: '中国大陆手机号',
  },
  {
    name: '邮箱',
    pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
    desc: '常用邮箱格式',
  },
  {
    name: '身份证',
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',
    desc: '18位身份证号码',
  },
  {
    name: 'IP地址',
    pattern: '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    desc: 'IPv4地址',
  },
  {
    name: 'URL',
    pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$',
    desc: '常用URL格式',
  },
  {
    name: '日期',
    pattern: '^\\d{4}[-/\\.]\\d{1,2}[-/\\.]\\d{1,2}$',
    desc: 'YYYY-MM-DD格式的日期',
  },
  {
    name: '时间',
    pattern: '^\\d{1,2}:\\d{2}:\\d{2}$',
    desc: 'HH:mm:ss格式的时间',
  },
  {
    name: '汉字',
    pattern: '^[\\u4e00-\\u9fa5]+$',
    desc: '匹配中文字符',
  },
])

// 选择常用正则
const selectRegex = (item) => {
  regexPattern.value = item.pattern
}

// 正则语法参考
const regexSyntax = ref([
  { syntax: '.', desc: '匹配任意单个字符（除换行符）' },
  { syntax: '\\d', desc: '匹配数字，等价于 [0-9]' },
  { syntax: '\\w', desc: '匹配字母、数字、下划线' },
  { syntax: '^', desc: '匹配字符串开始位置' },
  { syntax: '$', desc: '匹配字符串结束位置' },
  { syntax: '*', desc: '匹配前一个元素0次或多次' },
  { syntax: '+', desc: '匹配前一个元素1次或多次' },
  { syntax: '?', desc: '匹配前一个元素0次或1次' },
  { syntax: '{n}', desc: '匹配前一个元素恰好n次' },
  { syntax: '[abc]', desc: '匹配方括号中的任意一个字符' },
  { syntax: '(a|b)', desc: '匹配a或b' },
  { syntax: '\\s', desc: '匹配空白字符（空格、制表符等）' },
  { syntax: '\\b', desc: '匹配单词边界' },
  { syntax: '\\B', desc: '匹配非单词边界' },
  { syntax: '(?:abc)', desc: '非捕获组，不捕获匹配' },
  { syntax: '(?=abc)', desc: '正向前瞻，匹配abc前的任意位置' },
  { syntax: '(?!abc)', desc: '负向前瞻，不匹配abc前的任意位置' },
  { syntax: '(?<=abc)', desc: '正向后瞻，匹配abc后的任意位置' },
  { syntax: '(?<!abc)', desc: '负向后瞻，不匹配abc后的任意位置' },
])
</script>

<style scoped>
.input-card {
  margin-bottom: 16px;
}

.quick-regex {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.result-card {
  margin-top: 16px;

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.error {
  color: #ff4d4f;
}

.highlight-text {
  font-family: Monaco, Consolas, monospace;
  white-space: pre-wrap;
}

:deep(.highlight) {
  padding: 2px 4px;
  border-radius: 2px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}

.regex-reference {
  margin-top: 12px;

  :deep(.ant-table) {
    font-size: 12px;
  }
}
</style>
