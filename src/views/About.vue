<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <AsciiDocViewer :content="content" />
      <Comment owner="1" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import Comment from '@/components/Comment.vue'

const content = `

= 关于本站
菩提思是一个融合技术分享与实用工具的个人博客平台，致力于提供优质的内容展示与便捷的在线服务。本站支持 \`AsciiDoc\` 格式文档渲染、代码高亮、时间线展示等特性，并集成评论系统促进交流互动。平台涵盖博客文章、工具集、个人思考等内容板块，同时提供多种在线实用工具，旨在为访客提供一站式的学习与创作体验。


== 演进历程
[timeline]
2019-06:: 采用 Hexo 搭建初始博客
2023-08:: 实现 Vue3 迁移
2024-05:: 从Markdown 迁移至 AsciiDoc
2025-02:: 增加各种在线工具

== 技术选型
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
* [ ] 进行移动端适配
* [ ] 增加更多在线工具

[quote]
「代码即诗，架构如画」追求功能完善，探索优雅实现。

`
</script>
