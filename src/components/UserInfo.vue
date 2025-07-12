<template>
  <a-modal :visible="visible" title="用户信息" :width="600" @ok="handleSubmit" @cancel="emit('update:visible', false)">
    <a-form :model="formState" :label-col="{ span: 6 }">
      <a-form-item label="用户头像">
        <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :custom-request="handleUpload"
          :file-list="fileList"
          @change="handleAvatarChange"
        >
          <img v-if="formState.avatar" :src="formState.avatar" class="avatar" />
          <div v-else>
            <plus-outlined />
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
        <div v-if="uploadError" class="upload-error">{{ uploadError }}</div>
      </a-form-item>

      <a-form-item label="用户昵称" required>
        <a-input v-model:value="formState.nickname" placeholder="请输入昵称" :maxlength="20" />
      </a-form-item>

      <a-form-item label="个人邮箱">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" :maxlength="50" />
      </a-form-item>

      <a-form-item label="个人简介">
        <a-textarea v-model:value="formState.brief" placeholder="介绍一下自己吧" :rows="3" :maxlength="100" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { updateAvatar, updateInfo } from '@/services/userService'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])
const formState = ref({ nickname: '', avatar: '', email: '', brief: '' })
const fileList = ref([])
const uploadError = ref('')
const uploadLoading = ref(false)

watch(() => props.visible, (visible) => {
  if (visible) {
    uploadError.value = ''
    const userStore = useUserStore()
    const { userInfo } = userStore
    formState.value = {
      nickname: userInfo?.nickname || '',
      avatar: userInfo?.avatar || '',
      email: userInfo?.email || '',
      brief: userInfo?.brief || ''
    }
    fileList.value = formState.value.avatar ? [{ url: formState.value.avatar }] : []
  }
})

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    uploadError.value = '只能上传图片文件!' 
    return Upload.LIST_IGNORE
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    uploadError.value = '图片大小不能超过 2MB!' 
    return Upload.LIST_IGNORE
  }
  uploadError.value = ''
  return true
}

const handleUpload = async ({ file, onSuccess, onError }) => {
  uploadLoading.value = true
  uploadError.value = ''
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await updateAvatar(formData)
    const avatarUrl = response.data
    formState.value.avatar = avatarUrl
    onSuccess({ url: avatarUrl }, file)
    useUserStore().updateInfo({ avatar: avatarUrl })
    message.success('头像上传成功')
  } catch (error) {
    uploadError.value = '头像上传失败: ' + error.message
    console.log('头像上传失败', error)
    onError(error)
  } finally {
    uploadLoading.value = false
  }
}

const handleAvatarChange = (info) => {
  if (info.file.status === 'done') {
    formState.value.avatar = info.file.response?.url
  } else if (info.file.status === 'error') {
    uploadError.value = '头像上传失败，请重试'
  }
}

const handleSubmit = async () => {
  if (!formState.value.nickname) {
    return message.error('昵称不能为空')
  }
  try {
    await updateInfo(formState.value)
    useUserStore().updateInfo(formState.value)
    message.success('用户信息已保存')
    emit('update:visible', false)
  } catch (error) {
    message.error('保存失败：' + error.message)
    console.log('保存失败', error)
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader {
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.upload-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}
</style>
