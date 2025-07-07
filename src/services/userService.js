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
export async function updateUserInfo(data) {
  return await fetch('/user/update', { method: 'POST', body: data })
}
