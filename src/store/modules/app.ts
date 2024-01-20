import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash'
import router from '@/router'
import { getMenus } from '@/api'
import { generateRoute } from '@/utils'

const useAppStore = defineStore('app', {
  state: () => {
    return {
      menus: [],
      routes: [],
    }
  },
  actions: {
    async setRoutes() {
      const {
        response: {
          value: { data },
        },
      } = await getMenus()
      this.menus = data
      const routes = generateRoute(cloneDeep(data))
      router.addRoute({
        path: '/',
        redirect: '/home',
        component: () => import('@/layout/index.vue'),
        children: routes,
      } as RouteRecordRaw)
      this.routes = data
    },
  },
})

export default useAppStore
