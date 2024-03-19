import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import Layout from '@/layout'
import { useUserStore } from '@/store'
import { useAppStore } from '@/store'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
} as RouterOptions)

router.beforeResolve(async (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.getToken()) {
    const appStore = useAppStore()
    if (appStore.routes.length === 0) {
      await appStore.setRoutes()
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      next({ path: '/login', replace: true, query: to.query })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  const appStore = useAppStore()
  if (to.fullPath !== '/login' && !appStore.tabsList.some((o) => o.fullPath === to.fullPath)) {
    appStore.addTabs(to)
  }
  window.scrollTo(0, 0)
})

export default router
