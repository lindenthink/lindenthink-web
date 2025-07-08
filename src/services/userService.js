import useApiFetch from '@/composables/useApiFetch'

const fetch = useApiFetch()


export async function login(data) {
  return await fetch('/user/login', { method: 'POST', body: data })
}

export async function register(data) {
  return await fetch('/user/register', { method: 'POST', body: data })
}

export async function getCaptcha() {
  return await fetch('/user/captcha', { stream: true })
}

// 更新用户信息
export async function updateInfo(data) {
  return await fetch('/user/update/info', { method: 'POST', body: data })
}

// 更新用户密码
export async function updatePassword(data) {
  return await fetch('/user/update/password', { method: 'POST', body: data })
}
