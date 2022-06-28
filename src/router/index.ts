import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/Articles.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('@/views/articles/ArticleView.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/views/Tools.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/Links.vue'),
  },
]

const router = createRouter({
  history,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
      // return { top: 0, behavior: 'smooth' }
    }
  },
})

export default router
