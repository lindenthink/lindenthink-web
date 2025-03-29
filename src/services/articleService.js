import useApiFetch from '@/composables/useApiFetch'

export async function getArticle(id) {
  const fetch = useApiFetch()
  return await fetch(`/articles/${id}`)
}

export async function getArticles(req) {
  const fetch = useApiFetch()
  return await fetch('/articles', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}
