<template>
  <a-row :gutter="16">
    <!-- 左侧输入区域 -->
    <a-col :span="12">
      <a-card title="Cron表达式校验">
        <a-tag color="blue" style="margin-bottom: 12px">示例：0 0 12 * * ?</a-tag>

        <a-input v-model:value="cronExpression" placeholder="请输入Cron表达式" allow-clear @change="validateCron" />
        <div class="validation-result">
          <a-alert
            v-if="validationResult"
            :message="validationResult.message"
            :type="validationResult.type"
            show-icon
          />
        </div>
        <a-button type="primary" block style="margin-top: 16px" @click="translateCron"> 解析表达式 </a-button>
      </a-card>
    </a-col>

    <!-- 右侧展示区域 -->
    <a-col :span="12">
      <a-card title="人类可读格式">
        <a-textarea
          :value="humanReadable"
          placeholder="解析结果将在此显示"
          :auto-size="{ minRows: 8, maxRows: 12 }"
          readonly
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import cronstrue from 'cronstrue/i18n'

const cronExpression = ref('')
const validationResult = ref(null)
const humanReadable = ref('')

// Cron表达式基础校验
const validateCron = () => {
  if (!cronExpression.value) {
    validationResult.value = {
      type: 'info',
      message: '等待输入...',
    }
    return
  }

  try {
    cronstrue.toString(cronExpression.value)
    validationResult.value = {
      type: 'success',
      message: '基础格式校验通过',
    }
  } catch (error) {
    validationResult.value = {
      type: 'error',
      message: `语义校验失败：${error.message}`,
    }
  }
}

// 翻译为可读格式
const translateCron = () => {
  try {
    humanReadable.value = cronstrue.toString(cronExpression.value, {
      verbose: true,
      use24HourTimeFormat: true,
      locale: 'zh_CN',
    })
  } catch (error) {
    humanReadable.value = `解析失败：${error.message}`
  }
}
</script>

<style scoped>
.validation-result {
  margin: 12px 0;
  min-height: 60px;
}
</style>
