<template>
  <a-row :gutter="24">
    <!-- 左侧配置区 -->
    <a-col :span="12">
      <a-card title="密码规则配置">
        <a-form layout="horizontal" :label-col="{ span: 6 }">
          <a-form-item label="密码长度">
            <a-slider
              v-model:value="config.length"
              :min="6"
              :max="32"
              :marks="{ 6: '6', 12: '12', 18: '18', 24: '24', 32: '32' }"
            />
          </a-form-item>

          <a-form-item label="包含字符类型">
            <a-checkbox-group v-model:value="config.rules">
              <a-checkbox value="lower">小写字母 (a-z)</a-checkbox>
              <a-checkbox value="upper">大写字母 (A-Z)</a-checkbox>
              <a-checkbox value="number">数字 (0-9)</a-checkbox>
              <a-checkbox value="symbol">特殊符号 (!@#$%^&*)</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="排除易混淆字符">
            <a-checkbox v-model:checked="config.excludeAmbiguous"> 排除 0O1lI </a-checkbox>
          </a-form-item>
        </a-form>

        <a-button type="primary" block size="large" @click="generatePassword">
          <template #icon><reload-outlined /></template>
          生成密码
        </a-button>
      </a-card>
    </a-col>

    <!-- 右侧结果区 -->
    <a-col :span="12">
      <a-card title="生成结果">
        <div class="result-container">
          <a-input v-model:value="password" placeholder="生成的密码将在此显示" readonly class="password-input" />
          <div class="copy-button-wrapper">
            <a-tooltip title="复制密码">
              <a-button type="link" :disabled="!password" @click="copyPassword">
                <copy-outlined />
              </a-button>
            </a-tooltip>
          </div>
        </div>

        <div class="password-strength">
          <a-alert :message="strength.label" :type="strength.type" :description="strength.description" show-icon />
        </div>
      </a-card>
    </a-col>
  </a-row>
  <!-- 安全建议 -->
  <a-collapse style="margin-top: 24px">
    <a-collapse-panel key="1" header="密码安全建议">
      <a-descriptions bordered :column="1">
        <a-descriptions-item label="长度原则">
          <li>普通账户至少12位</li>
          <li>重要账户至少16位</li>
        </a-descriptions-item>
        <a-descriptions-item label="复杂度要求">
          <li>至少包含3种字符类型</li>
          <li>避免连续字符(如1234)</li>
        </a-descriptions-item>
        <a-descriptions-item label="管理建议">
          <li>不同账户使用不同密码</li>
          <li>定期更换重要密码</li>
          <li>启用两步验证</li>
        </a-descriptions-item>
      </a-descriptions>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons-vue'

const config = ref({
  length: 12,
  rules: ['lower', 'upper', 'number', 'symbol'],
  excludeAmbiguous: true,
})

const password = ref('')

// 密码强度计算
const strength = computed(() => {
  const rulesCount = config.value.rules.length
  const length = config.value.length

  if (length < 8 || rulesCount < 2) {
    return {
      label: '弱密码',
      type: 'error',
      description: '不符合最低安全要求',
    }
  }

  if (length >= 16 && rulesCount >= 3) {
    return {
      label: '强密码',
      type: 'success',
      description: '符合高标准安全要求',
    }
  }

  return {
    label: '中等强度',
    type: 'warning',
    description: '建议增加长度或字符类型',
  }
})

// 生成密码逻辑
const generatePassword = () => {
  try {
    // 检查至少选择一种规则
    if (config.value.rules.length === 0) {
      message.error('请至少选择一种字符类型')
      return
    }

    // 构建基础字符集
    const baseSets = {
      lower: 'abcdefghijklmnopqrstuvwxyz', // 包含所有小写
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // 包含所有大写
      number: '0123456789', // 包含所有数字
      symbol: '!@#$%^&*',
      ambiguous: '0O1lI', // 易混淆字符
    }

    let chars = ''
    const mustInclude = []

    // 构建可用字符集
    config.value.rules.forEach((rule) => {
      let set = baseSets[rule]

      // 处理排除易混淆字符
      if (config.value.excludeAmbiguous && rule !== 'symbol') {
        set = set.replace(new RegExp(`[${baseSets.ambiguous}]`, 'g'), '')
      }

      chars += set
      mustInclude.push(set) // 记录必须包含的字符集
    })

    // 生成必须包含的字符
    let passwordArray = []
    mustInclude.forEach((set) => {
      const randomIndex = Math.floor(Math.random() * set.length)
      passwordArray.push(set[randomIndex])
    })

    // 生成剩余字符
    const remainingLength = config.value.length - mustInclude.length
    const array = new Uint32Array(remainingLength)
    window.crypto.getRandomValues(array)

    const remainingChars = Array.from(array).map((n) => chars[n % chars.length])

    passwordArray = passwordArray.concat(remainingChars)

    // 打乱顺序
    passwordArray = passwordArray.sort(() => Math.random() - 0.5)

    password.value = passwordArray.join('')
  } catch (error) {
    message.error('生成失败：' + error.message)
  }
}

// 复制功能
const copyPassword = () => {
  navigator.clipboard
    .writeText(password.value)
    .then(() => message.success('已复制到剪贴板'))
    .catch(() => message.error('复制失败'))
}
</script>

<style scoped>
.result-container {
  position: relative;
}

.password-input {
  font-family: monospace;
  font-size: 18px;
  padding-right: 40px;
}

.copy-button-wrapper {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.password-strength {
  margin-top: 16px;
}

.ant-alert {
  border-radius: 8px;
}

.ant-descriptions-item-content li {
  margin: 6px 0;
}

.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
</style>
