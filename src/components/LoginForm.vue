<template>
  <a-modal :visible="visible" title="用户认证" :footer="null" @cancel="handleCancel">
    <div class="mode-selector">
      <a-radio-group v-model:value="activeKey">
        <a-radio-button value="login">登录</a-radio-button>
        <a-radio-button value="register">注册</a-radio-button>
      </a-radio-group>
    </div>

    <a-form v-if="activeKey === 'login'" @finish="handleLogin" class="ancient-style-form" :model="formModel"
      :label-col="{ span: 6 }">
      <a-form-item name="username" label="账号" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formModel.username" ref="usernameInput" />
      </a-form-item>
      <a-form-item name="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]">
        <a-input type="password" v-model:value="formModel.password" />
      </a-form-item>
      <a-form-item name="captcha" label="验证码" :rules="[{ required: true, message: '请输入验证码' }]">
        <div class="captcha-container">
          <a-input style="width: 120px" v-model:value="formModel.captcha" />
          <img :src="captchaUrl" alt="验证码" @click="refreshCaptcha" class="captcha-img" />
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" class="ancient-button" :loading="loginLoading">登录</a-button>
      </a-form-item>
    </a-form>

    <a-form v-else @finish="handleRegister" class="ancient-style-form" :model="formModel" :label-col="{ span: 6 }">
      <a-form-item name="username" label="账号" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formModel.username" ref="usernameInput" />
      </a-form-item>
      <a-form-item name="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]">
        <a-input type="password" v-model:value="formModel.password" />
      </a-form-item>
      <a-form-item name="confirmPassword" label="确认密码" :rules="[
        { required: true, message: '请确认密码' },
        { validator: (rule, value) => validateConfirmPassword(rule, value, formModel.password) }
      ]">
        <a-input type="password" v-model:value="formModel.confirmPassword" />
      </a-form-item>
      <a-form-item name="captcha" label="验证码" :rules="[{ required: true, message: '请输入验证码' }]">
        <div class="captcha-container">
          <a-input style="width: 120px" v-model:value="formModel.captcha" />
          <img :src="captchaUrl" alt="验证码" @click="refreshCaptcha" class="captcha-img" />
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" class="ancient-button" :loading="registerLoading">注册</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { login, register, getCaptcha } from '@/services/userService'
import { useUserStore } from '@/stores/user'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'login-success'])
const userStore = useUserStore()
const activeKey = ref('login')
const captchaUrl = ref('')
const formModel = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

const usernameInput = ref(null)
const loginLoading = ref(false)
const registerLoading = ref(false)

const refreshCaptcha = async () => {
  try {
    // 获取响应，使用流式响应类型
    const res = await getCaptcha()
    captchaUrl.value = res
  } catch (error) {
    console.error('获取验证码失败:', error)
    message.error('获取验证码失败: ' + error.message)
  }
}

const handleLogin = async (values) => {
  loginLoading.value = true
  try {
    const res = await login(values)
    userStore.login(res.data)
    emit('login-success', res.data)
    handleCancel()
  } catch (error) {
    console.error('登录失败:', error)
    message.error('登录失败: ' + error.message)
    refreshCaptcha()
  } finally {
    loginLoading.value = false
  }
}

const validateConfirmPassword = (rule, value, password) => {
  if (value && value !== password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const handleRegister = async (values) => {
  registerLoading.value = true
  try {
    await register(values)
    message.success('注册成功，请登录')
    activeKey.value = 'login'
    handleCancel()
  } catch (error) {
    message.error('注册失败: ' + error.message)
    console.error('注册失败:', error)
  } finally {
    registerLoading.value = false
  }
}

const handleCancel = () => {
  emit('update:visible', false)
}

const focusInput = () => {
  nextTick(() => {
    if (usernameInput.value) {
      usernameInput.value.focus()
    }
  })
}

// 初始化验证码和输入框焦点
watch(() => props.visible, (visible) => {
  if (visible) {
    refreshCaptcha()
    focusInput()
  }
})

watch(activeKey, (key) => {
  focusInput()
})

</script>

<style lang="less" scoped>
.ancient-style-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #2a93e9;
  border-radius: 8px;
  font-family: 'SimSun', serif;
}

.mode-selector {
  text-align: center;
  margin-bottom: 20px;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-img {
  margin-left: 10px;
  cursor: pointer;
}
</style>