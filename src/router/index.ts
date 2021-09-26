import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('@/views/Article.vue'),
  },
]

const router = createRouter({
  history,
  routes,
})

export default router
