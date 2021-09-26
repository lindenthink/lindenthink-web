import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueMarkdownEditor, VMdPreview } from './static/mdeditor'

createApp(App).use(router).use(VueMarkdownEditor).use(VMdPreview).mount('#app')