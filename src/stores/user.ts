import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

interface User {
  name?: string
  id?: number
  isAdmin?: boolean
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({})

  return { user }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
