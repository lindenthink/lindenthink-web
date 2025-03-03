<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <AsciiDocViewer :content="asciidocContent" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import AsciiDocViewer from '@/components/common/AsciiDocViewer.vue'

const asciidocContent = `

= 关于我

一个有几年经验的后端开发人员，有着远大的理想抱负但总三天打鱼两天晒网，平凡缺不甘于平凡。每天在和自己做抗争，不想这么虚度光阴，希望自己的人生是充实的。  

喜欢古风，尤其痴迷优美的诗句和歌曲，陶醉其中。为生活奔波忙碌我们，偶尔也要停下脚步欣赏沿途的美好，对未来充满期待脚步才会更加轻快。

= 关于本站
“知识有两种，一种是你知道的，另一种是你知道在哪里能找到的”，记录博客恰好就是一个整理知识的过程。

开发这个网站之前已经摸索了很长一段时间，对比了很多博客框架后一度认为\`Hexo\`满足了我的需要。为此花了很多时间和精力去补充和调整，也在基于Hexo实现的博客网站上写了几篇文章。

但用了一段时间之后发现静态网站很难扩展而且，所以决定自己来实现个人网站。做起来还是挺难的，前后花了很长时间去搜索相关的实现。过程中碰上Vue3发布就试着用了下，但可参考的文档还比较少，不少概念理解起来比较困难就搁置了一段时间。

自己实现的念想一直没断过，过了一段事件又拾起来，此时vue3的文档比较全了而且很多框架也都进行升级和更新，因此又开始着手准备。那时为了是实现某个功能每天查资料或者学习到很晚，随着模块很功能的逐渐完善，越来越有成就感，这也是我坚持这么久的原因。
网站还在不断完善中，希望自己能够更加有动力去学习和记录，也希望能给他人带来些许的参考和帮助。

努力永远不会太迟！

= 感谢
网站的建设离不开很多开源框架以及API等，在这里特别感谢：

* vue3
** https://router.vuejs.org/
** https://cn.vitejs.dev/[vite]
* https://www.typescriptlang.org/zh/[typescript]
* https://lesscss.com.cn/[less]
* https://yarn.bootcss.com/[yarn]
// * Vben Admin：
// * https://aplayer.js.org/
// * https://www.live2d.com/zh-CHS/
// * https://github.com/fghrsh/live2d_demo
// * https://hitokoto.cn/[一言]
// * https://www.jinrishici.com/[今日诗词]
* https://www.antdv.com/docs/vue/introduce-cn[Ant Design of Vue]
* https://github.com/hankcs/HanLP/tree/1.x[HanLP]
* https://highlightjs.readthedocs.io/en/latest/[highlightjs]
`
</script>

<style lang="less" scoped>
</style>
