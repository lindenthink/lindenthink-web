<template>
  <a-layout>
    <a-layout-sider>
      <div v-if="anchors.length" class="article-toc">
        <a-tabs v-model:active-key="activeKey" centered>
          <a-tab-pane key="1" tab="系列" v-if="article.seriesId">
            <div class="article-toc-content">
              <div v-for="(item, index) in series" :key="index" style="border-bottom: 1px #f0f2f5 solid">
                <FileOutlined :style="{ color: 'grey' }" /> <a>{{ item }}</a>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="目录">
            <div class="article-toc-content">
              <a-anchor :affix="false" :offset-top="58" show-ink-in-fixed>
                <a-anchor-link v-for="(anchor, index) in anchors" :key="index" :href="anchor.href"
                  :title="anchor.title">
                  <a-anchor-link v-for="(anchor2, index2) in anchor.children" v-if="anchor.hasChildren" :key="index2"
                    :href="anchor2.href" :title="anchor2.title">
                    <a-anchor-link v-for="(anchor3, index3) in anchor2.children" v-if="anchor2.hasChildren"
                      :key="index3" :href="anchor3.href" :title="anchor3.title">
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
      <div class="loading-container" v-if="isLoading || !article.id">
        <a-spin tip="文章加载中..." />
      </div>
      <template v-else>
        <a-badge-ribbon :text="article.type == 'ORIGINAL' ? '原创' : '转载'"
          :color="article.type == 'ORIGINAL' ? 'blue' : 'orange'" style="z-index: 9">
          <a-breadcrumb style="margin: 0 20px; padding: 10px 0; border-bottom: 1px #f0f2f5 solid">
            <a-breadcrumb-item> <router-link :to="{ path: '/articles' }"> 列表 </router-link></a-breadcrumb-item>
            <a-breadcrumb-item>正文</a-breadcrumb-item>
          </a-breadcrumb>
        </a-badge-ribbon>

        <div class="article">
          <div class="article-head">
            <h1 class="article-head-title">{{ article.title }}</h1>
            <div class="article-head-tag">
              <a-tooltip placement="bottom" title="分类" arrow-point-at-center>
                <a-tag color="blue">
                  <template #icon><paper-clip-outlined /></template>{{ article.categoryName }}
                </a-tag>
              </a-tooltip>
              <a-tooltip placement="bottomLeft" title="标签" arrow-point-at-center v-if="article.tags">
                <a-tag v-for="tag in article.tags?.split(',')" :key="tag" color="cyan">
                  <template #icon><tag-outlined /></template>{{ tag }}
                </a-tag>
              </a-tooltip>
              <a-tooltip v-if="article.type !== 'ORIGINAL'" placement="bottom" title="外链" arrow-point-at-center>
                <a :href="article.origin" target="_blank">
                  <a-tag color="orange">
                    <template #icon><link-outlined /></template>原文
                  </a-tag>
                </a>
              </a-tooltip>
            </div>
            <div class="article-head-meta">
              <EditOutlined style="margin-right: 5px" />
              <span>作者：{{ article.author }}</span>
              <a-divider type="vertical"></a-divider>
              <CalendarOutlined style="margin-right: 5px" /><span>发表于：{{ dayjs(article.updated).format('YYYY-MM-DD')
                }}</span><a-divider type="vertical"></a-divider>
              <a-divider v-if="article.type !== 'ORIGINAL'" type="vertical"></a-divider>
              <EyeOutlined style="margin-right: 5px" /><span>浏览数：{{ article.visitCount }}</span><a-divider
                type="vertical"></a-divider>
              <LikeOutlined style="margin-right: 5px" /><span>点赞数：{{ article.praiseCount }}</span><a-divider
                type="vertical"></a-divider>
              <MessageOutlined style="margin-right: 5px" />
              <span>评论数：{{ article.commentCount }}</span>
            </div>
          </div>

          <AsciiDocViewer ref="viewerRef" :content="article.content" />

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

            <a-divider :style="{ color: 'lightgrey' }">•</a-divider>
            <div class="article-foot-nav">
              <div v-if="article.prevId">
                <router-link :to="{ path: `/articles/${article.prevId}` }"> <left-outlined /> {{ article.prevTitle }}
                </router-link>
              </div>
              <div v-else>
                没有上一篇了
              </div>
              <div v-if="article.nextId">
                <router-link :to="{ path: `/articles/${article.nextId}` }"> {{ article.nextTitle }} <right-outlined />
                </router-link>
              </div>
              <div v-else>
                没有下一篇了
              </div>
            </div>
          </div>
        </div>

        <Comment ref="commentRef" :owner="article.id" />
      </template>
    </a-layout-content>

    <a-layout-sider> </a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, onBeforeMount, nextTick, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  PaperClipOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import Comment from '@/components/Comment.vue'
import dayjs from 'dayjs'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import { getArticle } from '@/services/articleService'
// import { TagColors, showMessage, bindTip } from '@/static/linden'

const props = defineProps({
  id: String,
})

const router = useRouter()
const route = useRoute()
const article = ref({})
const anchors = ref([])
const curUrl = location.href
const isLoading = ref(false)
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

const loadArticle = async (id) => {
  isLoading.value = true
  try {
    const res = await getArticle(id)
    if (res) {
      article.value = res.data
      await generateAnchors() // 生成目录锚点
    } else {
      message.warning('文章不存在')
      router.back()
    }
  } catch (e) {
    console.error(e)
    message.error(e.message || '加载失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

// 初始加载
onBeforeMount(() => {
  loadArticle(props.id)
})

// 监听路由变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadArticle(newId)
    }
  }
)

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

async function generateAnchors(retryCount = 0) {
  await nextTick() // 等待DOM更新
  try {
    if (!viewerRef.value || !viewerRef.value.$el) {
      // console.error('viewerRef is not available');
      // 添加重试逻辑，最多重试3次
      if (retryCount < 3) {
        console.log(`尝试重试生成目录，当前重试次数: ${retryCount + 1}`);
        // 等待300毫秒后重试
        setTimeout(() => generateAnchors(retryCount + 1), 300);
      } else {
        message.error('无法生成目录: 内容查看器未准备好');
      }
      return;
    }

    const hList = viewerRef.value.$el.querySelectorAll('h1,h2,h3,h4')
    // 正在处理的父锚点集合
    const parentAnchors = []
    anchors.value = []; // 清空现有锚点

    hList.forEach((el, i) => {
      const nextEl = hList.length === i + 1 ? null : hList[i + 1]
      el.id = 'toc-' + i;
      const currentLevel = parseInt(el.tagName.substring(1))
      const nextLevel = nextEl ? parseInt(nextEl.tagName.substring(1)) : 0

      const anchor = {
        id: el.id,
        title: el.innerText.trim(),
        href: '#' + el.id,
        level: currentLevel,
        hasChildren: nextEl && currentLevel < nextLevel,
        children: [],
      }

      // 找到合适的父级
      while (parentAnchors.length > 0 && parentAnchors.at(-1).level >= currentLevel) {
        parentAnchors.pop()
      }

      if (parentAnchors.length > 0) {
        const parentAnchor = parentAnchors.at(-1)
        parentAnchor.children.push(anchor)
        parentAnchor.hasChildren = true;
      } else {
        anchors.value.push(anchor)
      }

      // 当前锚点作为可能的父级
      parentAnchors.push(anchor)

      // 如果下一级别小于等于当前级别，弹出当前锚点
      if (nextEl && nextLevel <= currentLevel) {
        parentAnchors.pop()
      }
    })
  } catch (error) {
    console.error('Error generating anchors:', error)
    message.error(`生成目录时出错: ${error.message}`);
  }
}
</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
}

.article {
  background-color: white;
  margin-top: 5px;
}

.article-head {
  text-align: center;

  .article-head-title {
    color: #2c3e50;
    font-size: 2.2em;
    font-weight: 600;
  }

  .article-head-tag {
    margin-top: -0.5em;
    margin-bottom: 1em;
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
  top: 74px;
  z-index: 9;
  margin-right: 10px;
  max-width: 260px;
  left: 12%;

  .article-toc-content {
    padding: 0 10px 10px 5px;
  }
}
</style>
