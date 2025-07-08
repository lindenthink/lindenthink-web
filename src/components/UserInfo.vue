<template>
  <a-modal :visible="visible" title="用户信息" :width="600" @ok="handleSubmit" @cancel="emit('update:visible', false)">
    <a-form :model="formState" :label-col="{ span: 6 }">
      <a-form-item label="用户头像">
        <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
          :before-upload="beforeUpload" @change="handleAvatarChange">
          <img v-if="formState.avatar" :src="formState.avatar" class="avatar" />
          <div v-else>
            <plus-outlined />
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item label="用户昵称" required>
        <a-input v-model:value="formState.nickname" placeholder="请输入昵称" :maxlength="20" />
      </a-form-item>

      <a-form-item label="个人简介">
        <a-textarea v-model:value="formState.bio" placeholder="介绍一下自己吧" :rows="3" :maxlength="100" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])


const formState = ref({ nickname: '', avatar: '', bio: '' })


watch(() => props.visible, (visible) => {
  if (visible) {
    const userStore = useUserStore()
    const { userInfo } = userStore
    console.log('userInfo', userInfo)
    formState.value = {
      nickname: userInfo?.nickname || '',
      avatar: userInfo?.avatar || '',
      bio: userInfo?.bio || ''
    }
  }
})

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  return isImage
}

const handleAvatarChange = (info) => {
  if (info.file.status === 'done') {
    formState.value.avatar = URL.createObjectURL(info.file.originFileObj)
  }
}

const handleSubmit = async () => {
  if (!formState.value.nickname) {
    return message.error('昵称不能为空')
  }
  try {
    const userStore = useUserStore()
    userStore.updateInfo(formState.value)
    message.success('设置已保存')
    emit('update:visible', false)
  } catch (error) {
    message.error('保存失败' + error.message)
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
</style>
