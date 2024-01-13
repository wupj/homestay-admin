import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import Layout from '@/layout'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: '/order',
        name: 'order',
        children: [
          {
            path: '/order/list',
            name: 'orderList',
            component: () => import('@/views/order/list.vue'),
          },
        ],
      },
      {
        path: '/homestay',
        name: 'homestay',
        children: [
          {
            path: '/homestay/list',
            name: 'homestayList',
            component: () => import('@/views/homestay/list.vue'),
          },
        ],
      },
      {
        path: '/coupon',
        name: 'coupon',
        children: [
          {
            path: '/coupon/list',
            name: 'couponList',
            component: () => import('@/views/coupon/list.vue'),
          },
        ],
      },
      {
        path: '/role',
        name: 'role',
        children: [
          {
            path: '/role/list',
            name: 'roleList',
            component: () => import('@/views/role/list.vue'),
          },
        ],
      },
      {
        path: '/user',
        name: 'user',
        children: [
          {
            path: '/user/list',
            name: 'userList',
            component: () => import('@/views/user/list.vue'),
          },
        ],
      },
      {
        path: '/log',
        name: 'log',
        children: [
          {
            path: '/log/list',
            name: 'logList',
            component: () => import('@/views/log/list.vue'),
          },
        ],
      },
    ],
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

export default router
