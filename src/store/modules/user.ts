import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router'

interface AppState {
  userInfo?: unknown
}

const useUserStore = defineStore('user', {
  state: (): AppState => ({
    userInfo: null,
  }),
  actions: {
    setUserInfo(data) {
      this.userInfo = data.userInfo
      this.setToken(data)
    },
    getToken() {
      return useCookies().get('token')
    },
    setToken(data) {
      const {
        token,
        userInfo: { notLogin },
      } = data
      const maxAge = notLogin ? 60 * 60 * 24 * 30 : 60 * 60 * 6
      useCookies().set('token', token, {
        path: location.origin,
        maxAge: maxAge,
      })
    },
    logOut() {
      useCookies().remove('token')
      router.push('/login')
    },
  },
})

export default useUserStore
