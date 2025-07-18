import useApiFetch from '@/composables/useApiFetch'

export async function getArticle(id) {
  const fetch = useApiFetch()
  return await fetch(`/article/${id}`)
}

export async function queryArticles(data) {
  const fetch = useApiFetch()
  return await fetch('/article/query', {
    method: 'POST',
    body: data,
  })
}

export async function saveArticle(data) {
  const fetch = useApiFetch()
  return await fetch('/article/save', {
    method: 'POST',
    body: data,
  })
}
