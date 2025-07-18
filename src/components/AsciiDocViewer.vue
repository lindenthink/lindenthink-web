<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="asciidoc-viewer" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import asciidoctor from '@asciidoctor/core'
import kroki from 'asciidoctor-kroki'
import hljs from 'highlight.js'
/**
 * 参考：https://github.com/highlightjs/highlight.js/tree/main/src/styles
 * 暗色：vs2015.css github-dark.css atom-one-dark.css night-owl.css
 * 浅色: default.css docco.css foundation.css panda-syntax-light.css
 */
import 'highlight.js/styles/vs2015.css'

// 定义 props
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})
// 渲染后的内容
const renderedContent = ref('')

const emit = defineEmits(['render-complete']);

// 初始化 Asciidoctor
const asciidoc = asciidoctor()
// 启用 Kroki 插件以支持 PlantUML
kroki.register(asciidoc.Extensions)

// 渲染 AsciiDoc 内容
const renderContent = async() => {
  try {
    if (!props.content) {
      return
    }
    // 过滤掉不支持的关键字
    const filteredContent = props.content.replace(/opts="inline"/g, '')
    renderedContent.value = asciidoc.convert(filteredContent, {
      safe: 'safe', // 安全模式
      attributes: {
        showtitle: true, // 显示标题
        'kroki-server-url': 'https://kroki.io', // 使用 Kroki 服务
        'source-highlighter': 'highlightjs', // 启用代码高亮
      },
      ...props.options, // 合并传入的选项
    })

    // 渲染完成后处理代码块
    await nextTick()
    const codeBlocks = document.querySelectorAll('.asciidoc-viewer pre code')
      codeBlocks.forEach((block) => {
        // 检查是否已经添加了行号
        if (block.parentNode.querySelector('.code-with-line-numbers')) {
          return
        }

        // 高亮代码
        hljs.highlightElement(block)

        // 添加行号，先暂存当前文本内容供复制使用
        const textContent = block.textContent
        const lines = block.innerHTML.split('\n')
        const numberedLines = lines
          .map((line, index) => `<span class="line-number">${index + 1}</span> ${line}`)
          .join('\n')
        block.innerHTML = `<div class="code-with-line-numbers">${numberedLines}</div>`

        // 获取语言
        const language = block.className.split('-')[1].split(' ')[0] || 'text'

        // 创建工具栏
        const toolbar = document.createElement('div')
        toolbar.className = 'code-toolbar'
        toolbar.innerHTML = `
          <div class="toolbar-content">
            <span class="language">${language}</span>
            <button class="copy-button">Copy</button>
          </div>
        `

        // 插入工具栏
        block.parentNode.insertBefore(toolbar, block)

        // 绑定复制事件
        const copyButton = toolbar.querySelector('.copy-button')
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(textContent).then(() => {
            copyButton.textContent = 'Copied!'
            setTimeout(() => {
              copyButton.textContent = 'Copy'
            }, 2000)
          })
        })
      })
    } catch (error) {
      console.error('Failed to render AsciiDoc:', error)
      renderedContent.value = '<p>Error rendering AsciiDoc content.</p>'
    } finally {
      emit('render-complete');
    }
  }

// 监听 content 变化，重新渲染
watch(() => props.content, renderContent, { immediate: true })

</script>

<style>
/* 全局样式 */
.asciidoc-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 90%;
  margin: 0 auto 4em auto;
  padding: 0 20px;
}

/* 标题样式 */
.asciidoc-viewer h1,
.asciidoc-viewer h2,
.asciidoc-viewer h3,
.asciidoc-viewer h4,
.asciidoc-viewer h5,
.asciidoc-viewer h6 {
  color: #2c3e50;
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.asciidoc-viewer h1 {
  font-size: 2em;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3em;
}

.asciidoc-viewer h2 {
  font-size: 1.75em;
}

.asciidoc-viewer h3 {
  font-size: 1.5em;
}

/* 段落样式 */
.asciidoc-viewer p {
  margin: 1em 0;
  color: #555;
}

/* 列表样式 */
.asciidoc-viewer ul,
.asciidoc-viewer ol {
  margin: 1em 0;
  padding-left: 2em;
}

.asciidoc-viewer li {
  margin: 0.5em 0;
}

/* 代码块样式 */
.asciidoc-viewer pre {
  position: relative;
  background-color: #f6f8fa;
  padding: 0em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5em 0;
  font-size: 0.9em;
}

.asciidoc-viewer code {
  font-family: 'Courier New', Courier, monospace;
}

.asciidoc-viewer p code {
  color: #d63384;
  /* 代码文本颜色 */
  background-color: #eaecf1;
  /* 代码背景颜色 */
  padding: 2px 4px;
  /* 内边距 */
  border-radius: 4px;
  /* 圆角 */
  font-family: 'Courier New', Courier, monospace;
  /* 字体 */
}

.line-number {
  display: inline-block;
  width: 2em;
  user-select: none;
  opacity: 0.5;
  text-align: right;
  padding-right: 0.5em;
  margin-right: 0.5em;
  border-right: 1px solid #ddd;
}

/* 工具栏样式 */
.code-toolbar {
  position: absolute;
  right: 0;
  background-color: #c8cace;
  padding: 0.1em 0.1em;
  border-radius: 0 6px;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.language {
  font-size: 0.875em;
  color: #505861;
}

.copy-button {
  margin-top: 0.1em;
  background-color: #838b94;
  color: white;
  border: none;
  padding: 0em 0.2em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875em;

  &:hover {
    background-color: #6c757d;
  }
}

/* 表格样式 */
.asciidoc-viewer table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.asciidoc-viewer th,
.asciidoc-viewer td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.asciidoc-viewer th {
  background-color: #f6f8fa;
  font-weight: 600;
}

/* 引用样式 */
.asciidoc-viewer blockquote {
  margin: 1.5em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #ddd;
  color: #666;
  background-color: #f9f9f9;
}

/* 链接样式 */
.asciidoc-viewer a {
  color: #0366d6;
  text-decoration: none;
}

.asciidoc-viewer a:hover {
  text-decoration: underline;
}

.asciidoc-viewer .content img {
  text-align: center;
}

/* 图片父元素居中 */
.asciidoc-viewer .imageblock {
  text-align: center;
}

.asciidoc-viewer img {
  max-width: 100%;
  height: auto;
}
</style>
