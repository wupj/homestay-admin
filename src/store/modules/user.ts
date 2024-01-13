import { defineStore } from 'pinia'

interface AppState {
  userInfo?: unknown
}

const useUserStore = defineStore('user', {
  state: (): AppState => ({
    userInfo: null,
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
  },
})

export default useUserStore
