<template>
  <a-row :gutter="16">
    <!-- 时间戳转时间 -->
    <a-col :span="12">
      <a-card title="时间戳转时间">
        <a-input-number v-model:value="timestampInput" placeholder="输入时间戳" :precision="0" style="width: 100%" />
        <div class="conversion-options">
          <a-radio-group v-model:value="timestampUnit">
            <a-radio-button value="s">秒级</a-radio-button>
            <a-radio-button value="ms">毫秒级</a-radio-button>
          </a-radio-group>
        </div>
        <a-button type="primary" block style="margin: 16px 0" @click="convertToDateTime"> 转换 </a-button>
        <a-textarea :value="humanTime" placeholder="转换结果" readonly :auto-size="{ minRows: 3 }" />
      </a-card>
    </a-col>

    <!-- 时间转时间戳 -->
    <a-col :span="12">
      <a-card title="时间转时间戳">
        <a-date-picker v-model:value="dateTime" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        <a-button type="primary" block style="margin: 16px 0" @click="convertToTimestamp"> 转换 </a-button>
        <a-textarea :value="convertedTimestamp" placeholder="转换结果" readonly :auto-size="{ minRows: 3 }" />
        <div class="copy-actions">
          <a-tag color="blue">当前时间戳：{{ currentTimestamp }}</a-tag>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const timestampInput = ref(null)
const timestampUnit = ref('s')
const dateTime = ref(null)
const humanTime = ref('')
const convertedTimestamp = ref('')

// 实时显示当前时间戳
const currentTimestamp = ref(Math.floor(Date.now() / 1000))

const convertToDateTime = () => {
  if (!timestampInput.value) {
    message.warning('请输入时间戳')
    return
  }

  const timestamp = timestampUnit.value === 's' ? timestampInput.value * 1000 : timestampInput.value

  humanTime.value = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const convertToTimestamp = () => {
  if (!dateTime.value) {
    message.warning('请选择时间')
    return
  }

  const timestamp = dayjs(dateTime.value).valueOf()
  convertedTimestamp.value = `${timestamp} (毫秒)\n${Math.floor(timestamp / 1000)} (秒)`
}
</script>

<style scoped>
.conversion-options {
  margin: 12px 0;
}

.copy-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
