<template>
  <a-modal 
    :visible="visible" 
    title="修改密码" 
    :width="600" 
    @ok="handleSubmit" 
    @cancel="emit('update:visible', false)"
    :confirm-loading="loading"
  >
    <a-form :model="formState" :label-col="{ span: 6 }" :rules="rules" ref="formRef">
      <a-form-item label="旧密码" name="oldPassword">
        <a-input type="password" v-model:value="formState.oldPassword" placeholder="请输入旧密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input type="password" v-model:value="formState.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认新密码" name="confirmPassword">
        <a-input type="password" v-model:value="formState.confirmPassword" placeholder="请再次输入新密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch,nextTick } from 'vue'

import { message } from 'ant-design-vue'
import { updatePassword } from '@/services/userService'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const formState = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码'}],
  newPassword: [{ required: true, message: '请输入新密码'}, { min: 6, message: '新密码长度不能小于6位' }],
  confirmPassword: [{ required: true, message: '请确认新密码' }, { validator: (rule, value, callback) => { if (value !== formState.value.newPassword) { callback(new Error('两次输入的新密码不一致')) } else { callback() } }, trigger: 'blur' }]
}
const formRef = ref(null)

watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      formRef.value.resetFields()
    })
  }
})

const handleSubmit = async () => {
  await formRef.value.validateFields()
  loading.value = true
  try {
    await updatePassword({
      oldPassword: formState.value.oldPassword,
      newPassword: formState.value.newPassword
    })
    message.success('密码修改成功')
    emit('update:visible', false)
  } catch (error) {
    message.error('密码修改失败: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>