import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  nickname: string
  avatar: string
  token: string
  bio?: string
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null as UserInfo | null,
  }),
  actions: {
    login(userData: UserInfo) {
      this.isLoggedIn = true
      this.userInfo = userData
      localStorage.setItem('userInfo', JSON.stringify(userData))
    },
    logout() {
      this.isLoggedIn = false
      this.userInfo = null
      localStorage.removeItem('userInfo')
    },
    updateProfile(updateData: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updateData }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      }
    },
  },
})
