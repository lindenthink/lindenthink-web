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
    path: '/articles/:id',
    name: 'article-view',
    component: () => import('@/views/article/ArticleView.vue'),
    props: true,
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/views/Tools.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/tools/FormatJson.vue'),
      }, {
        path: 'format-json',
        name: 'format-json',
        component: () => import('@/views/tools/FormatJson.vue'),
      }, {
        path: 'format-sql',
        name: 'format-sql',
        component: () => import('@/views/tools/FormatSql.vue'),
      }, {
        path: 'format-xml',
        name: 'format-xml',
        component: () => import('@/views/tools/FormatXml.vue'),
      }, {
        path: 'encode-base64',
        name: 'encode-base64',
        component: () => import('@/views/tools/EncodeBase64.vue'),
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
