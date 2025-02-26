<template>
  <div class="asciidoc-viewer" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import asciidoctor from '@asciidoctor/core';
import kroki from 'asciidoctor-kroki';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 引入高亮主题样式


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
});

// 初始化 Asciidoctor
const asciidoc = asciidoctor();

// 启用 Kroki 插件以支持 PlantUML
kroki.register(asciidoc.Extensions);

// 渲染后的内容
const renderedContent = ref('');

// 渲染 AsciiDoc 内容
const renderContent = () => {
  try {
    renderedContent.value = asciidoc.convert(props.content, {
      safe: 'safe', // 安全模式
      attributes: {
        showtitle: true, // 显示标题
        'kroki-server-url': 'https://kroki.io', // 使用 Kroki 服务
        'source-highlighter': 'highlightjs', // 启用代码高亮
      },
      ...props.options, // 合并传入的选项
    });

    // 渲染完成后处理代码块
    nextTick(() => {
      const codeBlocks = document.querySelectorAll('.asciidoc-viewer pre code');
      codeBlocks.forEach((block) => {
          // 检查是否已经添加了行号
        if (block.parentNode.querySelector('.code-with-line-numbers')) {
          return;
        }
  
        // 高亮代码
        hljs.highlightBlock(block);

        // 添加行号
        const lines = block.innerHTML.split('\n');
        const numberedLines = lines.map((line, index) => `<span class="line-number">${index + 1}</span> ${line}`).join('\n');
        block.innerHTML = `<div class="code-with-line-numbers">${numberedLines}</div>`;

        // 获取语言
        const language = block.className.split('-')[1].split(' ')[0] || 'text';

        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';
        toolbar.innerHTML = `
          <div class="toolbar-content">
            <span class="language">${language}</span>
            <button class="copy-button">Copy</button>
          </div>
        `;

        // 插入工具栏
        block.parentNode.insertBefore(toolbar, block);

        // 绑定复制事件
        const copyButton = toolbar.querySelector('.copy-button');
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(block.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          });
        });
      });
      
    });
  } catch (error) {
    console.error('Failed to render AsciiDoc:', error);
    renderedContent.value = '<p>Error rendering AsciiDoc content.</p>';
  }
};

// 监听 content 变化，重新渲染
watch(() => props.content, renderContent, { immediate: true });

// 组件挂载后初始化高亮
onMounted(() => {
  renderContent();
});
</script>

<style>
/* 全局样式 */
.asciidoc-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
}

/* 标题样式 */
.asciidoc-viewer h1,
.asciidoc-viewer h2,
.asciidoc-viewer h3,
.asciidoc-viewer h4,
.asciidoc-viewer h5,
.asciidoc-viewer h6 {
  color: #2c3e50;
  margin-top: 1.5em;
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
}

.copy-button:hover {
  background-color: #0d94e7;
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
</style>