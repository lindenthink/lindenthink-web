import useApiFetch from '@/composables/useApiFetch'

export async function getQrcode() {
  const fetch = useApiFetch()
  return await fetch('/user/auth/qrcode')
}

export async function checkAuth(ticket) {
  const fetch = useApiFetch()
  return await fetch(`/user/auth/check?ticket=${ticket}`)
}
