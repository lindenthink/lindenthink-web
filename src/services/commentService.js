import useApiFetch from '@/composables/useApiFetch'

export async function getComments(articleId) {
  const fetch = useApiFetch()
  return await fetch('/comments/' + articleId)
}

export async function addComment(data) {
  const fetch = useApiFetch()
  return await fetch('/comment', {
    method: 'put',
    body: data,
  })
}
