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
    component: () => import('@/components/article/ArticleView.vue'),
    props: true,
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/views/Tools.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/tools/FormatJson.vue'),
      },{
        path: 'format-json',
        name: 'format-json',
        component: () => import('@/components/tools/FormatJson.vue'),
      },{
        path: 'format-sql',
        name: 'format-sql',
        component: () => import('@/components/tools/FormatSql.vue'),
      },{
        path: 'encode-base64',
        name: 'base64-json',
        component: () => import('@/components/tools/EncodeBase64.vue'),
      }
    ]

  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/workbench',
    name: 'workbench',
    component: () => import('@/views/Workbench.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('@/views/Friends.vue'),
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
