import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import router from './router'
import vRipple from '@/directives/ripple'
import App from './App.vue'
import { createPinia } from 'pinia'

import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(createPinia())
app.directive('ripple', vRipple)
app.mount('#app')
