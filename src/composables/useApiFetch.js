import { createFetch } from '@vueuse/core'
import { useUserStore } from '@/stores/user'

export default function useApiFetch() {
  return async (url, options = {}) => {
    const { error, data } = await useMyFetch(url, options)
    if (error.value) {
      throw error.value
    }
    return data.value
  }
}

const useMyFetch = createFetch({
  baseUrl: import.meta.env.VITE_API_BASEURL,
  options: {
    timeout: 10000,
    beforeFetch({ options }) {
      return beforeMyFetch(options)
    },
    async afterFetch({ data, response, context, execute }) {
      return await afterMyFetch(data, response, context, execute)
    },
    onFetchError({ error, response }) {
      return onMyFetchError(error, response)
    },
  },
})

function beforeMyFetch(options) {
  options.credentials = 'include'
  // 处理form-data
  if (!options.form) {
    options.headers['Content-Type'] = 'application/json'
  }
  // 处理stream响应
  if (options.stream) {
    options.responseType = 'stream'
  }
  const { userInfo } = useUserStore()
  if (userInfo?.token) {
    options.headers.Authorization = `Bearer ${userInfo.token}`
  }
  if (options.body && options.headers['Content-Type'] === 'application/json') {
    if (!options.body.pagination) {
      options.body = JSON.stringify({ data: options.body })
    } else {
      options.body = JSON.stringify(options.body)
    }
  }
  return { options }
}

async function afterMyFetch(data, response, context, execute) {
  const newToken = response.headers.get('X-New-Access-Token')
  if (newToken) {
    console.log(`刷新token: ${newToken}`)
    useUserStore().updateInfo({ token: newToken })
  }
  const { stream } = context.options
  if (stream) {
    const reader = response.body.getReader()
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    const contentType = response.headers.get('Content-Type')
    const blob = new Blob(chunks, { type: contentType })
    return { data: URL.createObjectURL(blob) }
  }
  if (!data) {
    throw new Error('响应数据为空')
  }
  const result = JSON.parse(data)
  if (result?.code < 0) {
    throw new Error(result.message || '未知错误')
  }
  return { data: result }
}

function onMyFetchError(error, response) {
  console.log('onFetchError', error, response)
  let msg
  if (!response?.status) {
    return { error: new Error('网络错误') }
  }
  switch (response.status) {
    case 401:
      msg = '请先登录再操作'
      break
    case 403:
      useUserStore().logout()
      msg = '登录过期，请重新登录'
      break
    case 404:
      msg = '请求资源不存在'
      break
    default:
      msg = error.message || '请求失败：' + response.status
  }
  error = new Error(msg)
  return { error }
}
