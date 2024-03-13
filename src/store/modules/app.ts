import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash'
import router from '@/router'
import useTheme from '@/hooks/useTheme'
import { getMenus } from '@/api'
import { generateRoute } from '@/utils'

const useAppStore = defineStore('app', {
  state: () => {
    return {
      menus: [],
      routes: [],
      tabsList: [],
      theme: useTheme().theme,
      layoutLoading: false,
    }
  },
  actions: {
    async setRoutes() {
      this.layoutLoading = true
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
      const homeRoute = router.getRoutes().find((o) => o.name === 'home')
      homeRoute.fullPath = '/home'
      this.addTabs(homeRoute)
      this.routes = data
      this.layoutLoading = false
    },
    addTabs(tab: RouteRecordRaw) {
      this.tabsList.push(tab)
    },
    deleteTabs(type: string, index?: number) {
      if (type === 'left') {
        this.tabsList.splice(1, index - 1)
      } else if (type === 'right') {
        this.tabsList.splice(index + 1)
      } else if (type === 'other') {
        this.tabsList = this.tabsList.filter((o) => o.fullPath !== this.tabsList[index].fullPath)
      } else if (type === 'all') {
        this.tabsList.splice(1)
      } else {
        this.tabsList.splice(index, 1)
      }
      if (!this.tabsList.some((o) => o.fullPath === location.pathname)) {
        router.push(this.tabsList[this.tabsList.length - 1].fullPath)
      }
    },
    refreshLayout() {
      this.layoutLoading = true
      nextTick(() => {
        this.layoutLoading = false
      })
    },
  },
})

export default useAppStore
