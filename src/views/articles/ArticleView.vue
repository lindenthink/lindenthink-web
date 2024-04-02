<template>
  <a-layout>
    <a-layout-sider>
      <div class="article-toc">
        <a-tabs v-model:activeKey="activeKey" centered>
          <a-tab-pane key="1" tab="系列总览">
            <div class="article-toc-content">
              <div v-for="item in series" style="border-bottom: 1px #f0f2f5 solid">
                <FileOutlined :style="{ color: 'grey' }" /> <a>{{ item }}</a>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="本文目录">
            <!-- <h4 style="text-align: center; font-weight: bold">文章目录</h4> -->
            <div class="article-toc-content">
              <a-anchor :affix="false" :offsetTop="40" showInkInFixed>
                <a-anchor-link
                  :href="anchor.href"
                  :title="anchor.title"
                  :key="index"
                  v-for="(anchor, index) in anchors"
                >
                  <a-anchor-link
                    :href="anchor2.href"
                    :title="anchor2.title"
                    :key="index2"
                    v-for="(anchor2, index2) in anchor.children"
                    v-if="anchor.hasChildren"
                  >
                    <a-anchor-link
                      :href="anchor3.href"
                      :title="anchor3.title"
                      :key="index3"
                      v-for="(anchor3, index3) in anchor2.children"
                      v-if="anchor2.hasChildren"
                    >
                    </a-anchor-link>
                  </a-anchor-link>
                </a-anchor-link>
              </a-anchor>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-sider>

    <a-layout-content>
      <a-affix offset-top="6">
        <a-breadcrumb separator=">" style="background-color: #f0f2f5; padding: 10px">
          <a-breadcrumb-item> <router-link :to="{ path: '/articles' }"> 文章 </router-link></a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link :to="{ path: '/articles' }">
              {{ tabName }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>正文</a-breadcrumb-item>
        </a-breadcrumb>
      </a-affix>

      <a-badge-ribbon text="原创" color="pink" style="z-index: 9">
        <div class="article">
          <div class="article-head">
            <h1 class="article-head-title">解放C盘</h1>
            <div class="article-head-meta">
              <EditOutlined style="margin-right: 5px" />
              <span>作者：Linden</span>
              <a-divider type="vertical"></a-divider>
              <CalendarOutlined style="margin-right: 5px" /><span>发表于：2022-04-24</span
              ><a-divider type="vertical"></a-divider> <EyeOutlined style="margin-right: 5px" /><span>浏览数：202</span
              ><a-divider type="vertical"></a-divider> <LikeOutlined style="margin-right: 5px" /><span>点赞数：202</span
              ><a-divider type="vertical"></a-divider> <MessageOutlined style="margin-right: 5px" />
              <span>评论数：20</span><br />
            </div>
            <a-typography style="text-align: left; padding: 0rem 2.5rem">
              <blockquote style="letter-spacing: 0.3em; font-weight: 150">
                C盘一般都是作为系统盘来使用，相对空间会小一些。由于大多软件默认都是安装到这个磁盘，而且我们平时使用的应用依赖的配置或者缓存文件也同样存到这个磁盘中，所以它的空间很容易被占满。
              </blockquote>
            </a-typography>
          </div>

          <my-md-editor mode="preview" :content="text" ref="editor" />

          <div class="article-foot">
            <div style="text-align: center"></div>
            <ul class="article-foot-copyright">
              <li><strong>本文作者：</strong>流年</li>
              <li>
                <strong>本文链接：</strong>
                <a href="{{curUrl}}" title="解放C盘">{{ curUrl }}</a>
              </li>
              <li>
                <strong>版权声明：</strong>本博客所有文章除特别声明外，均采用
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="noopener" target="_blank"
                  ><copyright-outlined />BY-NC-SA</a
                >
                许可协议。转载请注明出处！
              </li>
            </ul>
            <div style="display: flex; justify-content: space-between">
              <span>分类：JAVA</span>
              <div>
                标签：
                <a-tag>
                  <template #icon>
                    <tag-outlined />
                  </template>
                  JAVA
                </a-tag>
                <a-tag>
                  <template #icon> <tag-outlined /> </template>
                  HTML
                </a-tag>
                <a-tag>
                  <template #icon> <tag-outlined /> </template>
                  CSS
                </a-tag>
              </div>
            </div>
            <a-divider :style="{ color: 'lightgrey' }">•</a-divider>
            <div class="article-foot-nav">
              <div>
                <a href="#"><left-outlined /> 文章1文章1文章1</a>
              </div>
              <div>
                <a href="#">文章2文章2文章2文章2 <right-outlined /></a>
              </div>
            </div>
          </div>
        </div>
      </a-badge-ribbon>

      <MyComment ref="commentRef" target="1" />
    </a-layout-content>
    <a-layout-sider>
      <div class="fixed-praise" @click="clickPraise" :style="{ 'background-color': isPraise ? '#1890ff' : '' }">
        <LikeOutlined class="fixed-btn-icon" ref="likeRef" />
      </div>
      <div class="fixed-comment" @click="clickComment">
        <MessageOutlined class="fixed-btn-icon" />
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CopyrightOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CalendarOutlined,
  TagOutlined,
  FileOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import MyMdEditor from '@/components/MyMdEditor.vue'
import MyComment from '@/components/MyComment.vue'
import { TagColors, showMessage, bindTip } from '@/static/linden'

const tabNameMap = new Map([
  ['list', '列表'],
  ['series', '系列'],
  ['archive', '归档'],
])
const tagColors = TagColors

const router = useRouter()
const routeParams: any = router.currentRoute.value.params
const tabKey = routeParams['tab']
const tabName = tabNameMap.get(tabKey)
const isPraise = ref(false)
const curUrl = location.href
const commentRef: any = ref()
const likeRef: any = ref()
const activeKey = ref('2')
const series = [
  'Racing car .',
  'Japanese princess.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
]

onMounted(() => {
  bindTip()
})
const recommendInterval = setInterval(() => showMessage('这篇文章怎么样啊，记得点赞和评论喔(*^_^*)', 4000), 100000)
onUnmounted(() => clearInterval(recommendInterval))

const text = `
# Markdown Editor

<p align="left">
  <a href="https://npmcharts.com/compare/@kangc/v-md-editor?minimal=true"><img src="https://img.shields.io/npm/dm/@kangc/v-md-editor.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@kangc/v-md-editor"><img src="https://img.shields.io/npm/v/@kangc/v-md-editor.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@kangc/v-md-editor"><img src="https://img.shields.io/npm/l/@kangc/v-md-editor.svg?sanitize=true" alt="License"></a>
</p>

## Links

- [Demo](https://code-farmer-i.github.io/vue-markdown-editor/examples/base-editor.html)
- [Documentation](https://code-farmer-i.github.io/vue-markdown-editor/)
- [Changelog](https://code-farmer-i.github.io/vue-markdown-editor/changelog.html)

## Install

\`\`\`bash
# use npm
npm i @kangc/v-md-editor -S

# use yarn
yarn add @kangc/v-md-editor
\`\`\`

## Quick Start

\`\`\`js
import Vue from 'vue';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

VueMarkdownEditor.use(vuepressTheme);

Vue.use(VueMarkdownEditor);
\`\`\`

## Usage

\`\`\`html
<template>
  <v-md-editor v-model="text" height="400px"></v-md-editor>
</template>
\`\`\`

## Refrence
- [ElementUi Scrollbar Component](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar)
- [vuepress-plugin-container](https://vuepress.github.io/zh/plugins/container/)
`

const clickPraise = () => {
  isPraise.value = !isPraise.value
  if (isPraise.value) {
    showMessage('谢谢点赞，你的支持是对作者最大的鼓励！', 5000)
  }
}

const clickComment = () => {
  commentRef.value.scrollToReply()
}
</script>

<script lang="ts">
// 处理锚点
export default {
  data() {
    return {
      anchors: [],
    }
  },
  mounted() {
    const els = (this.$refs.editor as any).$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let id,
      el,
      nextEl,
      parentAnchors = [], // 正在处理的父锚点集合
      parentAnchor
    for (let i = 0; i < els.length; i++) {
      el = els[i]
      nextEl = els.length === i + 1 ? null : els[i + 1]
      id = 'toc-' + (i + 1)
      el.id = id
      let anchor: any = {
        id: id,
        title: el.innerText.trim(),
        href: '#' + id,
        tagName: el.tagName,
        hasChildren: el.tagName < nextEl?.tagName,
        children: [],
      }
      if (parentAnchors.length > 0) {
        parentAnchor = parentAnchors[parentAnchors.length - 1]
        parentAnchor.children.push(anchor)
      } else {
        this.anchors.push(anchor)
      }
      if (anchor.hasChildren) {
        parentAnchors.push(anchor)
      } else {
        while (true) {
          if (parentAnchors.length === 0 || parentAnchor.tagName < nextEl?.tagName) {
            break
          }
          parentAnchors.pop()
        }
      }
    }
  },
}
</script>

<style lang="less" scoped>
.ant-layout-content {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
  min-width: 780px;
}

.article {
  background-color: white;
  margin-top: 5px;
  padding: 10px;
}

.article-head {
  margin-top: 40px;
  text-align: center;
  .article-head-title {
    font-size: 2em;
  }
  .article-head-meta {
    margin: 3px 0 10px 0;
    color: #999;
    font-family: 'Lato', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 12px;
    text-align: center;
  }
}
.article-foot {
  padding: 0rem 2.5rem;
  .article-foot-copyright {
    padding: 0.5em 1em;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    list-style: none;
  }
  .article-foot-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
}

.article-toc {
  background-color: #fff;
  position: sticky;
  top: 120px;
  z-index: 9;
  margin-right: 10px;
  padding: 10px 0px 0px 0px;
  max-width: 200px;
  left: 8%;
  .article-toc-content {
    padding: 0 10px 10px 10px;
    max-height: 80vh;
    overflow-y: auto;
  }
}

:deep(.vuepress-markdown-body:not(.custom)) {
  padding: 1rem 2.5rem 2rem 2.5rem;
}

.mixin-fixed-btn(@index) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: 'tnum';
  position: fixed;
  right: 15vw;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  bottom: calc(14vh + @index * 50px);
  text-align: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .fixed-btn-icon {
    font-size: 24px;
    color: white;
    line-height: 40px;
  }
}

.fixed-praise {
  .mixin-fixed-btn(2);
}
.fixed-comment {
  .mixin-fixed-btn(1);
}
</style>
