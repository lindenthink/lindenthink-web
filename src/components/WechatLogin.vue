<template>
  <a-modal :visible="visible" title="微信扫码登录" :footer="null" @cancel="handleCancel">
    <div class="qrcode-container">
      <qrcode-vue v-if="qrcodeUrl" :value="qrcodeUrl" :size="220" level="H" />
      <div v-else>{{ showMessage }}</div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'

import { getQrcode, checkAuth } from '@/services/userService'

const props = defineProps({
  visible: Boolean,
})

const emit = defineEmits(['update:visible', 'login-success'])

const qrcodeUrl = ref('')
const showMessage = ref('正在生成二维码...')

// 获取二维码
const generateQrcode = async () => {
  try {
    const res = await getQrcode()
    qrcodeUrl.value = res.data.url
    checkLoginStatus(res.data.ticket)
  } catch (error) {
    console.error('获取二维码失败:', error)
    showMessage.value = '处理二维码失败: ' + error.message
  }
}

// 检查登录状态
const checkLoginStatus = (ticket) => {
  const timer = setInterval(async () => {
    const res = await checkAuth(ticket)
    if (res.data.status === 'success') {
      clearInterval(timer)
      emit('login-success', res.data.userInfo)
      handleCancel()
    }
  }, 2000)
}

const handleCancel = () => {
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (val) => {
    if (val) generateQrcode()
  },
)
</script>

<style lang="less" scoped>
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;

  /* 加载提示样式 */
  > div:not([class]) {
    color: #666;
    font-size: 14px;
    padding: 20px;
  }

  /* 二维码容器 */
  canvas {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

/* 适配移动端 */
@media (max-width: 768px) {
  .qrcode-container {
    canvas {
      width: 80% !important;
      height: auto !important;
    }
  }
}
</style>
