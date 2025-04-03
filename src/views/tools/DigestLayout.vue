<template>
  <a-row :gutter="24">
    <!-- 主功能区域 -->
    <a-col :span="12">
      <a-card :title="`${algorithmInfo.name}生成`">
        <div class="config-area">
          <a-input v-if="showHmacKey" v-model:value="hmacKey" placeholder="输入HMAC密钥" style="margin-bottom: 16px" />

          <a-textarea
            v-model:value="inputText"
            :placeholder="`输入要生成${algorithmInfo.name}摘要的内容`"
            :auto-size="{ minRows: 8, maxRows: 12 }"
            allow-clear
          />
        </div>

        <a-button type="primary" block size="large" style="margin-top: 16px" @click="generateDigest">
          <template #icon><form-outlined /></template>
          生成{{ algorithmInfo.name }}摘要
        </a-button>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card :title="`${algorithmInfo.name}结果`">
        <a-input
          v-model:value="digestResult"
          :placeholder="`${algorithmInfo.name}结果将在此显示`"
          readonly
          class="result-input"
        >
          <template #suffix>
            <a-button type="link" @click="copyResult(digestResult)">
              <copy-outlined />
            </a-button>
          </template>
        </a-input>
        <div class="result-meta">
          <a-tag v-if="digestResult" color="blue"> 长度：{{ digestResult.length }} 字符 </a-tag>
          <a-tag v-if="digestResult" color="green"> 大写：{{ digestResult.toUpperCase() }} </a-tag>
        </div>
      </a-card>
    </a-col>
  </a-row>

  <!-- 算法说明 -->
  <a-collapse style="margin-top: 24px">
    <a-collapse-panel key="1" :header="`${algorithmInfo.name}算法说明`">
      <a-descriptions bordered :column="1">
        <a-descriptions-item v-for="(item, index) in algorithmInfo.description" :key="index" :label="item.label">
          <li v-for="(text, i) in item.items" :key="i">{{ text }}</li>
        </a-descriptions-item>
      </a-descriptions>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import CryptoJS from 'crypto-js'
import { CopyOutlined, FormOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  type: {
    type: String,
    default: 'md5',
    validator: (value) => ['md5', 'sha1', 'sha256', 'hmac'].includes(value),
  },
})

const inputText = ref('')
const hmacKey = ref('')
const digestResult = ref('')

const algorithms = {
  md5: {
    name: 'MD5',
    method: CryptoJS.MD5,
    description: [
      {
        label: '基本信息',
        items: ['输出长度：128位（32字符）', '设计者：Ronald Rivest', '首次发布：1992年'],
      },
      {
        label: '安全建议',
        items: ['不推荐用于安全敏感场景', '适用于文件完整性校验'],
      },
    ],
  },
  sha1: {
    name: 'SHA-1',
    method: CryptoJS.SHA1,
    description: [
      {
        label: '技术规格',
        items: ['输出长度：160位（40字符）', '标准化：FIPS PUB 180-4', '首个碰撞：2017年'],
      },
    ],
  },
  sha256: {
    name: 'SHA-256',
    method: CryptoJS.SHA256,
    description: [
      {
        label: '技术优势',
        items: ['输出长度：256位（64字符）', '比特币区块链采用算法', '当前推荐的安全标准'],
      },
    ],
  },
  hmac: {
    name: 'HMAC',
    method: (message, key) => CryptoJS.HmacSHA256(message, key),
    description: [
      {
        label: '核心特性',
        items: ['基于密钥的哈希消息认证', '需要配合哈希算法使用', '典型应用：API请求签名'],
      },
    ],
  },
}

const algorithmInfo = computed(() => ({
  ...algorithms[props.type],
  name: props.type === 'hmac' ? 'HMAC-SHA256' : algorithms[props.type].name,
}))

const showHmacKey = computed(() => props.type === 'hmac')

const generateDigest = () => {
  if (!inputText.value.trim()) {
    message.warning('请输入有效内容')
    return
  }

  try {
    const text = inputText.value

    if (props.type === 'hmac') {
      if (!hmacKey.value.trim()) {
        message.warning('请输入HMAC密钥')
        return
      }
      digestResult.value = algorithms.hmac.method(text, hmacKey.value).toString(CryptoJS.enc.Hex)
    } else {
      digestResult.value = algorithms[props.type].method(text).toString(CryptoJS.enc.Hex)
    }
  } catch (error) {
    message.error(`生成失败: ${error.message}`)
    digestResult.value = '生成错误'
  }
}

const copyResult = (text) => {
  if (!text) {
    message.warning('没有可复制的内容')
    return
  }
  navigator.clipboard
    .writeText(text)
    .then(() => message.success('复制成功'))
    .catch(() => message.error('复制失败'))
}
</script>

<style scoped>
/* 保持原有样式不变 */
.config-area {
  margin-bottom: 16px;
}

.result-input {
  font-family: 'Fira Code', monospace;
  font-size: 16px;
}

.result-meta {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ant-btn-block {
  height: 48px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .ant-col {
    width: 100% !important;
    max-width: 100%;
  }
}
</style>
