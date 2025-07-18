<template>
  <a-modal :visible="visible" title="用户信息" :width="600" @ok="handleSubmit" @cancel="emit('update:visible', false)">
    <a-form :model="formState" :label-col="{ span: 6 }">
      <a-form-item label="用户头像">
        <ImageUploader v-model="formState.avatar" upload-text="上传头像" />
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
import { useUserStore } from '@/stores/user'
import { updateInfo } from '@/services/userService'
// 导入ImageUploader组件
import ImageUploader from '@/components/ImageUploader.vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])
const formState = ref({ nickname: '', avatar: '', email: '', brief: '' })
const uploadError = ref('')

// 保留watch监听逻辑
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
  }
})

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
</style>
