import useApiFetch from '@/composables/useApiFetch'

export async function getFriends() {
  const fetch = useApiFetch()
  return await fetch('/friends')
}

export async function addFriend(data) {
  const fetch = useApiFetch()
  return await fetch('/friends', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
