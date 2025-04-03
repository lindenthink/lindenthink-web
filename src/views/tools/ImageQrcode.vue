<template>
  <a-row :gutter="16">
    <!-- 左侧输入区域 -->
    <a-col :span="12">
      <a-card title="输入文本">
        <a-textarea
          v-model:value="inputText"
          placeholder="请输入要生成二维码的内容"
          :auto-size="{ minRows: 10, maxRows: 20 }"
          allow-clear
        />
        <a-button type="primary" style="margin-top: 16px" @click="generateQrCode"> 生成二维码 </a-button>
      </a-card>
    </a-col>

    <!-- 右侧展示区域 -->
    <a-col :span="12">
      <a-card title="生成二维码">
        <div class="qrcode-container">
          <qrcode-vue v-if="qrCodeValue" ref="qrcodeRef" :value="qrCodeValue" :size="200" class="qrcode" />
          <div v-else class="placeholder">输入内容后生成二维码</div>
        </div>
        <a-button type="primary" style="margin-top: 16px" :disabled="!qrCodeValue" @click="downloadQrCode">
          下载二维码
        </a-button>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import QrcodeVue from 'qrcode.vue'

const inputText = ref('')
const qrCodeValue = ref('')
const qrcodeRef = ref(null)

const generateQrCode = async () => {
  if (!inputText.value.trim()) {
    message.warning('请输入有效内容')
    return
  }
  qrCodeValue.value = inputText.value
}

const downloadQrCode = async () => {
  if (!qrCodeValue.value) {
    message.warning('请先生成二维码并等待渲染完成')
    return
  }

  try {
    // 增加额外等待
    await nextTick()

    if (!qrcodeRef.value?.$el) {
      throw new Error('二维码元素未加载')
    }

    // const canvas = qrcodeRef.value.$el || qrcodeRef.value.$el.querySelector('canvas');
    const canvas = document.querySelector('canvas')

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`获取Canvas失败，实际元素类型：${canvas.constructor.name}`)
    }

    // 创建下载链接
    const link = document.createElement('a')
    canvas.toBlob(
      (blob) => {
        link.download = `qrcode_${Date.now()}.png`
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(link.href)
        }, 100)
      },
      'image/png',
      1,
    )
  } catch (error) {
    message.error(`下载失败：${error.message}`)
  }
}
</script>

<style scoped>
.qrcode-container {
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.placeholder {
  color: #999;
  font-size: 16px;
}

.qrcode {
  padding: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
