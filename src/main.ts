import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { VueMarkdownEditor, VMdPreview } from './static/mdeditor'
import router from './router'
import RippleDirective from './directives/ripple'
import App from './App.vue'

import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(VueMarkdownEditor)
app.use(VMdPreview)
app.directive('ripple', RippleDirective)
app.mount('#app')
