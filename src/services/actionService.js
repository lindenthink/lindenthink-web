import useApiFetch from '@/composables/useApiFetch'

export async function saveAction(data) {
  const fetch = useApiFetch()
  return await fetch('/action/save', {
    method: 'POST',
    body: data,
  })
}

export async function queryActions(data) {
  const fetch = useApiFetch()
  return await fetch('/action/query', {
    method: 'POST',
    body: data,
  })
}

export async function deleteAction(id) {
  const fetch = useApiFetch()
  return await fetch(`/action/${id}`, {
    method: 'DELETE',
  })
}
