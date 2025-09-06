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

export async function queryActionsByType(type) {
  const fetch = useApiFetch()
  return await fetch(`/action/${type}`)
}

export async function deleteAction(type, id) {
  const fetch = useApiFetch()
  return await fetch(`/action/${type}/${id}`, {
    method: 'DELETE',
  })
}
