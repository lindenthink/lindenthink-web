import { useFetch } from '@vueuse/core'
import { useUserStore } from '@/stores/user'


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
    if (!options.form) {
      options.headers = { 'Content-Type': 'application/json' }
    }
    options.credentials = 'include' // 确保发送 cookies
    const { userInfo } = useUserStore()
    if (userInfo?.token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${userInfo.token}`,
      }
    }
    if (options.body && options.headers['Content-Type'] === 'application/json') {
      options.body = JSON.stringify({ data: options.body })
    }
    return { url, options }
  }

  // 响应拦截
  const afterResponse = (str) => {
    const response = JSON.parse(str)
    if (response.code < 0) {
      throw new Error(response.message || '未知错误')
    }
    return response
  }

  return async (url, options = {}) => {
    const processed = beforeRequest(url, options)
    const { stream } = options

    if (stream) {
      // 处理流式响应
      const { response, error } = await request(processed.url, {
        ...processed.options,
        responseType: 'stream'
      })

      if (error.value) {
        handleError(error.value)
      }
      const reader = response.value.body.getReader()
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
      const contentType = response.value.headers.get('Content-Type')
      const blob = new Blob(chunks, { type: contentType })
      return URL.createObjectURL(blob)
    }

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
