import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import router from './router'
import vRipple from '@/directives/ripple'
import App from './App.vue'
import { createPinia } from 'pinia'

import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
    .use(Antd)
    .use(router)
    .use(createPinia())
    .directive('ripple', vRipple)
    .mount('#app')
