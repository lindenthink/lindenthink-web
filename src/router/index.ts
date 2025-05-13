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
      },
      {
        path: 'format-json',
        component: () => import('@/views/tools/FormatJson.vue'),
      },
      {
        path: 'format-sql',
        component: () => import('@/views/tools/FormatSql.vue'),
      },
      {
        path: 'format-xml',
        component: () => import('@/views/tools/FormatXml.vue'),
      },
      {
        path: 'encode-base64',
        component: () => import('@/views/tools/EncodeBase64.vue'),
      },
      {
        path: 'encode-url',
        component: () => import('@/views/tools/EncodeUrl.vue'),
      },
      {
        path: 'encode-unicode',
        component: () => import('@/views/tools/EncodeUnicode.vue'),
      },
      {
        path: 'encode-ascii',
        component: () => import('@/views/tools/EncodeAscii.vue'),
      },
      {
        path: 'encrypt-aes',
        component: () => import('@/views/tools/EncryptAes.vue'),
      },
      {
        path: 'encrypt-rsa',
        component: () => import('@/views/tools/EncryptRsa.vue'),
      },
      {
        path: 'image-qrcode',
        component: () => import('@/views/tools/ImageQrcode.vue'),
      },
      {
        path: 'image-base64',
        component: () => import('@/views/tools/ImageBase64.vue'),
      },
      {
        path: 'convert-timestamp',
        component: () => import('@/views/tools/ConvertTimestamp.vue'),
      },
      {
        path: 'convert-cron',
        component: () => import('@/views/tools/ConvertCron.vue'),
      },
      {
        path: 'digest-md5',
        component: () => import('@/views/tools/DigestMd5.vue'),
      },
      {
        path: 'digest-sha1',
        component: () => import('@/views/tools/DigestSha1.vue'),
      },
      {
        path: 'digest-sha256',
        component: () => import('@/views/tools/DigestSha256.vue'),
      },
      {
        path: 'digest-hmac',
        component: () => import('@/views/tools/DigestHmac.vue'),
      },
      {
        path: 'password-generator',
        component: () => import('@/views/tools/PasswordGenerator.vue'),
      },
      {
        path: 'password-manager',
        component: () => import('@/views/tools/PasswordManager.vue'),
      },
      {
        path: 'text-diff',
        component: () => import('@/views/tools/TextDiff.vue'),
        meta: { title: '文本比对工具' },
      },
      {
        path: 'text-regular',
        component: () => import('@/views/tools/TextRegular.vue'),
        meta: { title: '正则匹配工具' },
      },
    ],
  },
  {
    path: '/about',
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
