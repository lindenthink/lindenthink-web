<template>
  <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
  <a-row :gutter="16">
    <!-- 左侧上传区域 -->
    <a-col :span="12">
      <a-upload
        v-model:file-list="fileList"
        :before-upload="handleBeforeUpload"
        accept="image/png,image/jpeg"
        list-type="picture-card"
        @preview="handlePreview"
      >
        <div>
          <upload-outlined />
          <div style="margin-top: 8px">点击上传图片</div>
        </div>
      </a-upload>
    </a-col>

    <!-- 右侧展示区域 -->
    <a-col :span="12">
      <a-card>
        <a-textarea
          v-model:value="base64Image"
          placeholder="图片Base64编码内容将在此显示"
          :auto-size="{ minRows: 10, maxRows: 20 }"
          readonly
        />
        <a-button type="primary" style="margin-top: 16px" @click="copyBase64"> 复制内容 </a-button>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const base64Image = ref('')
const fileList = ref([])
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

const handleBeforeUpload = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    base64Image.value = reader.result
  }
  return false // 阻止自动上传
}

const copyBase64 = () => {
  navigator.clipboard
    .writeText(base64Image.value)
    .then(() => message.success('复制成功'))
    .catch(() => message.error('复制失败'))
}

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>
