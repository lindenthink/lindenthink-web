<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <AsciiDocViewer :content="content" />
      <Comment ref="commentRef" owner="1" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import Comment from '@/components/Comment.vue'

const content = `

= 关于本站

告别切换繁琐！常用工具 + 个人知识库无缝协同，让效率翻倍。

== 演进历程
[timeline]
2019-06:: 采用 Hexo 搭建初始博客
2023-08:: 实现 Vue3 迁移
2024-05:: 从Markdown 迁移至 AsciiDoc
2025-02:: 增加各种在线工具

== 技术架构
[cols="1,3"]
|===
| 前端 | Vue3 + Vite + Pinia + Ant Design Vue
| 后端 | Spring Boot + MySQL
| 工具链 | GitHub Actions + Docker
|===

== 特别致谢
link:https://antdv.com/[Ant Design Vue]:: 提供企业级 UI 组件
link:https://hanlp.com/[HanLP]:: 中文自然语言处理支持
link:https://highlightjs.org/[highlight.js]:: 代码高亮解决方案

== 未来规划
* [ ] 实现 \`AI\` 辅助写作功能
* [ ] 开发移动端适配版本

[quote]
「代码即诗，架构如画」追求功能完善，探索优雅实现。

`
</script>
