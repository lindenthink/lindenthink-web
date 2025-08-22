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

export async function deleteArticle(id) {
  const fetch = useApiFetch()
  return await fetch(`/article/${id}`, {
    method: 'DELETE',
  })
}

export async function getSeriesArticles(seriesId) {
  const fetch = useApiFetch()
  return await fetch(`/article/series/${seriesId}`)
}

export async function searchArticles(keyword) {
  const fetch = useApiFetch()
  return await fetch(`/article/search?keyword=${keyword}`)
}

export async function getTop3() {
  const fetch = useApiFetch()
  return await fetch(`/article/top3`)
}