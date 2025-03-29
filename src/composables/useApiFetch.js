import { useFetch } from '@vueuse/core'

// 获取环境变量配置的基准URL
const BASE_URL = import.meta.env.VITE_API_BASEURL

export function createRequest() {
  return (path, options = {}) => {
    const fullUrl = `${BASE_URL}${path}`
    return useFetch(fullUrl, options)
  }
}

export default function useApiFetch() {
  const request = createRequest()

  // 请求拦截
  const beforeRequest = (url, options) => {
    if (!options) {
      options = {}
    }
    options.headers = { 'Content-Type': 'application/json' }
    const token = localStorage.getItem('token')
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return { url, options }
  }

  // 响应拦截
  const afterResponse = (str) => {
    const response = JSON.parse(str)
    if (response.code > 0) {
      throw new Error(response.message)
    }
    return response
  }

  return async (url, options) => {
    const processed = beforeRequest(url, options)
    const { data, error } = await request(processed.url, processed.options)
    const finalRes = afterResponse(data.value)

    if (error.value) {
      handleError(error.value)
    }

    return finalRes
  }
}

// 统一错误处理
function handleError(error) {
  console.error('API Error:', error)

  // 根据状态码处理
  switch (error.response?.status) {
    case 401:
      window.location.href = '/login' // 跳转登录
      break
    case 404:
      alert('请求资源不存在')
      break
    default:
      alert(`请求失败：${error.message}`)
  }

  throw error // 继续抛出供业务层处理
}
