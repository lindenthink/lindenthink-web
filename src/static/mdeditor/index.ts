import VueMarkdownEditor from '@kangc/v-md-editor'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import 'https://unpkg.com/mermaid/dist/mermaid.min.js'
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn'
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'

import Prism from 'prismjs'

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createMermaidPlugin())
  .use(createTodoListPlugin())
  .use(createAlignPlugin())

VMdPreview.use(vuepressTheme, {
  Prism,
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createMermaidPlugin())
  .use(createTodoListPlugin())
  .use(createAlignPlugin())

export { VueMarkdownEditor, VMdPreview }
