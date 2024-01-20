import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import Layout from '@/layout'
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
  const appStore = useAppStore()
  if (appStore.routes.length === 0) {
    await appStore.setRoutes()
    next({ path: to.fullPath, replace: true, query: to.query })
  } else {
    next()
  }
})

export default router
