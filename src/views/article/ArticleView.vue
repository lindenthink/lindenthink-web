<template>
  <a-layout>
    <a-layout-sider>
      <div class="article-toc">
        <a-tabs v-model:activeKey="activeKey" centered>
          <a-tab-pane key="1" tab="系列">
            <div class="article-toc-content">
              <div v-for="(item, index) in series" :key="index" style="border-bottom: 1px #f0f2f5 solid">
                <FileOutlined :style="{ color: 'grey' }" /> <a>{{ item }}</a>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="目录">
            <div class="article-toc-content">
              <a-anchor :affix="false" :offsetTop="40" showInkInFixed>
                <a-anchor-link :href="anchor.href" :title="anchor.title" :key="index"
                  v-for="(anchor, index) in anchors">
                  <a-anchor-link :href="anchor2.href" :title="anchor2.title" :key="index2"
                    v-for="(anchor2, index2) in anchor.children" v-if="anchor.hasChildren">
                    <a-anchor-link :href="anchor3.href" :title="anchor3.title" :key="index3"
                      v-for="(anchor3, index3) in anchor2.children" v-if="anchor2.hasChildren">
                    </a-anchor-link>
                  </a-anchor-link>
                </a-anchor-link>
              </a-anchor>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-sider>

    <a-spin v-if="!article.id" tip="文章加载中..." />
    <a-layout-content v-else>
      <a-badge-ribbon :text="article.source" :color="article.source == '原创' ? 'blue' : 'orange'" style="z-index: 9;">
        <a-breadcrumb style="margin:0 20px;padding:10px 0; border-bottom:1px #f0f2f5 solid">
          <a-breadcrumb-item> <router-link :to="{ path: '/articles' }"> 列表 </router-link></a-breadcrumb-item>
          <a-breadcrumb-item>正文</a-breadcrumb-item>
        </a-breadcrumb>
      </a-badge-ribbon>


      <div class="article">
        <div class="article-head">
          <h1 class="article-head-title">{{ article.title }}</h1>
          <div class="article-head-meta">
            <EditOutlined style="margin-right: 5px" />
            <span>作者：{{ article.author }}</span>
            <a-divider type="vertical"></a-divider>
            <CalendarOutlined style="margin-right: 5px" /><span>发表于：{{ article.created }}</span><a-divider
              type="vertical"></a-divider>
            <EyeOutlined style="margin-right: 5px" /><span>浏览数：{{ article.visitCount }}</span><a-divider
              type="vertical"></a-divider>
            <LikeOutlined style="margin-right: 5px" /><span>点赞数：{{ article.praiseCount }}</span><a-divider
              type="vertical"></a-divider>
            <MessageOutlined style="margin-right: 5px" />
            <span>评论数：{{ article.commentCount }}</span><br />
          </div>
        </div>

        <AsciiDocViewer :content="article.content" ref="viewerRef" />

        <div class="article-foot">
          <div style="text-align: center"></div>
          <ul class="article-foot-copyright">
            <li><strong>本文作者：</strong>{{ article.author }}</li>
            <li>
              <strong>本文链接：</strong>
              <a href="{{curUrl}}" title="解放C盘">{{ curUrl }}</a>
            </li>
            <li>
              <strong>版权声明：</strong>本博客所有文章除特别声明外，均采用
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" rel="noopener"
                target="_blank"><copyright-outlined />BY-NC-SA</a>
              许可协议，转载请注明出处！
            </li>
          </ul>
          <div style="display: flex; justify-content: space-between">
            <span>分类：{{ article.category }}</span>
            <div>
              标签：
              <a-tag v-for="tag in article.tags" :key="tag">
                <template #icon>
                  <tag-outlined />
                </template>
                {{ tag }}
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

      <Comment ref="commentRef" target="1" />
    </a-layout-content>
    <a-layout-sider>
    </a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick } from 'vue'
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
import { message } from 'ant-design-vue';
import Comment from '@/components/Comment.vue'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import { getArticle } from '@/services/articleService'
// import { TagColors, showMessage, bindTip } from '@/static/linden'

const props = defineProps({
  id: String
})


const article = ref({})
const anchors = ref([])
const curUrl = location.href
const commentRef = ref()
const viewerRef = ref()
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

onBeforeMount(async () => {  // 更早的生命周期
  try {
    const res = await getArticle(props.id)
    if (res) {
      article.value = res
      await nextTick()  // 等待DOM更新
      generateAnchors() // 生成目录锚点
    } else {
      message.warning('文章不存在')
      useRouter().back()
    }
  } catch (e) {
    message.error(e.message || '加载失败')
  }
})

// onMounted(() => {
//   bindTip()
// })
// const recommendInterval = setInterval(() => showMessage('这篇文章怎么样啊，记得点赞和评论喔(*^_^*)', 4000), 100000)
// onUnmounted(() => clearInterval(recommendInterval))


// const clickPraise = () => {
//   isPraise.value = !isPraise.value
//   if (isPraise.value) {
//     showMessage('谢谢点赞，你的支持是对作者最大的鼓励！', 5000)
//   }
// }

function generateAnchors() {
  let hList = viewerRef.value.$el.querySelectorAll('h1,h2,h3')
  let el,
    nextEl,
    parentAnchors = [], // 正在处理的父锚点集合
    parentAnchor
  for (let i = 0; i < hList.length; i++) {
    el = hList[i]
    nextEl = hList.length === i + 1 ? null : hList[i + 1]
    el.id = 'toc-' + (i + 1)
    let anchor = {
      id: el.id,
      title: el.innerText.trim(),
      href: '#' + el.id,
      tagName: el.tagName,
      hasChildren: el.tagName < nextEl?.tagName,
      children: [],
    }
    if (parentAnchors.length > 0) {
      parentAnchor = parentAnchors[parentAnchors.length - 1]
      parentAnchor.children.push(anchor)
    } else {
      anchors.value.push(anchor)
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
}
</script>


<style lang="less" scoped>
.article {
  background-color: white;
  margin-top: 5px;
  padding: 10px;
}

.article-head {
  text-align: center;

  .article-head-title {
    color: #2c3e50;
    font-size: 2.2em;
    font-weight: 600;
  }

  .article-head-meta {
    color: #999;
    font-family: 'Lato', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 0.9em;
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
  left: 12%;

  .article-toc-content {
    padding: 0 10px 10px 10px;
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>