/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@kangc/v-md-editor/lib/theme/vuepress.js'
declare module '@kangc/v-md-editor'
declare module '@kangc/v-md-editor/lib/preview'
declare module '@kangc/v-md-editor/lib/plugins/line-number/index'
declare module '@kangc/v-md-editor/lib/plugins/copy-code/index'
declare module '@kangc/v-md-editor/lib/plugins/mermaid/cdn'
declare module '@kangc/v-md-editor/lib/plugins/todo-list/index'
declare module '@kangc/v-md-editor/lib/plugins/align'
