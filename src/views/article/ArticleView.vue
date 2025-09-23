<template>
  <div class="article-view-container">
    <DefineTemplate>
      <div class="article-toc">
        <a-tabs v-model:active-key="activeKey" centered>
          <a-tab-pane key="toc" tab="目录">
            <div class="article-toc-content" v-if="anchors.length">
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
            <div v-else>
              <p style="color: #999; text-align: center; padding: 10px 0;">暂无目录内容</p>
            </div>
          </a-tab-pane>
          <a-tab-pane key="series" tab="系列" v-if="article.seriesId">
            <div class="article-toc-content">
              <h3 v-if="article.seriesName" class="series-title">{{ article.seriesName }}</h3>
              <a-spin v-if="isLoadingSeries" tip="加载中..." size="small" />
              <div v-else>
                <div v-for="(item, index) in series" :key="index"
                  style="border-bottom: 1px #f0f2f5 solid; padding: 0.2rem 0.5rem;">
                  <FileOutlined :style="{ color: item.id === article.id ? '#ccc' : 'grey', marginRight: '5px' }" />
                  <a :href="`/articles/${item.id}`"
                    :style="{ color: item.id === article.id ? '#ccc' : '#1890ff', textDecoration: 'none' }"
                    :class="{ 'current-article': item.id === article.id }"
                    @click.prevent="item.id !== article.id ? router.push(`/articles/${item.id}`) : null">
                    {{ item.title }}
                  </a>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </DefineTemplate>

    <a-drawer v-model:visible="showMobileMenu" placement="left" :width="250">
      <ReuseTemplate />
    </a-drawer>
    <a-affix :offset-top="180" v-if="isMobile">
      <a-button @click="showMobileMenu = true" style="background-color:rgba(0, 0, 0, 0.6); color: #fff;">
        <MenuUnfoldOutlined />
      </a-button>
    </a-affix>
    <a-layout>
      <a-layout-sider breakpoint="md" collapsed-width="1">
        <template v-if="!isMobile">
          <ReuseTemplate />

        </template>
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
            <div class="article-status" v-if="currentUser && currentUser.id == article.userId">
              <a-tag :color="article.state === 'APPROVED' ? 'green' : 'red'" style="margin-right: 2vw;" v-if="!isMobile">
                {{ article.state === 'APPROVED' ? '已发布' : '未发布' }}
              </a-tag>
              <a-button size="small" type="link" @click="handleEdit" v-if="!isMobile">
                <FormOutlined />编辑
              </a-button>
              <!-- 分享功能区域 -->
              <a-button type="link" @click="handleShare" v-if="article.state === 'APPROVED'">
                <ShareAltOutlined />分享
              </a-button>
            </div>
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
                <a-tooltip v-if="article.type !== 'ORIGINAL'" placement="bottom" :title="article.origin"
                  arrow-point-at-center>
                  <a :href="article.origin" target="_blank">
                    <a-tag color="orange">
                      <template #icon><link-outlined /></template>原文
                    </a-tag>
                  </a>
                </a-tooltip>
              </div>
              <div class="article-head-meta">
                <EditOutlined style="margin-right: 5px" />
                作者： <UserCard :user-info="authorInfo"> <span style="cursor: pointer; color: #1890ff;"> {{ article.author
                    }} </span>
                </UserCard>
                <a-divider type="vertical"></a-divider>
                <CalendarOutlined style="margin-right: 5px" /><span>发表于：{{ dayjs(article.updated).format('YYYY-MM-DD')
                  }}</span><a-divider type="vertical"></a-divider>
                <a-divider v-if="article.type !== 'ORIGINAL'" type="vertical"></a-divider>
                <EyeOutlined style="margin-right: 5px" /><span>浏览数：{{ article.visitCount }}</span><a-divider
                  type="vertical"></a-divider>
                <HeartOutlined style="margin-right: 5px" /><span>喜欢数：{{ article.likeCount }}</span><a-divider
                  type="vertical"></a-divider>
                <MessageOutlined style="margin-right: 5px" />
                <span>评论数：{{ article.commentCount }}</span>
              </div>
            </div>

            <AsciiDocViewer ref="viewerRef" :content="article.content" />

            <a-divider :style="{ color: 'lightgrey' }">•</a-divider>

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

              <div class="article-foot-nav">
                <div v-if="article.prevId" class="article-foot-nav-prev">
                  <router-link :to="{ path: `/articles/${article.prevId}` }"> <left-outlined /> {{ article.prevTitle }}
                  </router-link>
                </div>
                <div v-else class="article-foot-nav-prev">
                  没有上一篇了
                </div>
                <HeartAnimation v-model="isLiked" @change="handleLikeChange" v-if="currentUser" />
                <div v-if="article.nextId" class="article-foot-nav-next">
                  <router-link :to="{ path: `/articles/${article.nextId}` }"> {{ article.nextTitle }} <right-outlined />
                  </router-link>
                </div>
                <div v-else class="article-foot-nav-next">
                  没有下一篇了
                </div>
              </div>
            </div>
          </div>

          <Comment ref="commentRef" :owner="article.id" :deletable="currentUser && currentUser.id == article.userId" />

        </template>
      </a-layout-content>

      <a-layout-sider breakpoint="md" collapsed-width="1"> </a-layout-sider>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, nextTick, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  CopyrightOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  CalendarOutlined,
  TagOutlined,
  FileOutlined,
  EditOutlined,
  PaperClipOutlined,
  LinkOutlined,
  ShareAltOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useMediaQuery, createReusableTemplate } from '@vueuse/core'
import Comment from '@/components/Comment.vue'
import dayjs from 'dayjs'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import { getArticle, getSeriesArticles } from '@/services/articleService'
import { saveAction, deleteAction } from '@/services/actionService'
import HeartAnimation from '@/components/HeartAnimation.vue'
import UserCard from '@/components/UserCard.vue'
// import { TagColors, showMessage, bindTip } from '@/static/linden'

const props = defineProps({
  id: String,
})

const showMobileMenu = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
const router = useRouter()
const route = useRoute()
const article = ref({})
const anchors = ref([])
const curUrl = location.href
const isLoading = ref(false)
const commentRef = ref()
const viewerRef = ref()
const activeKey = ref('toc')
const userStore = useUserStore()
const currentUser = ref(null)
const authorInfo = ref({})

onMounted(() => {
  currentUser.value = userStore.userInfo
})

// 编辑文章
const handleEdit = () => {
  router.push({ path: `/articles/editor/${article.value.id}` })
}
const series = ref([])
const isLoadingSeries = ref(false)
const isLiked = ref(false)

// 加载系列文章
const loadSeries = async (seriesId) => {
  isLoadingSeries.value = true
  try {
    const res = await getSeriesArticles(seriesId)
    if (res && res.data) {
      series.value = res.data
    } else {
      series.value = []
      message.warning('该系列没有文章')
    }
  } catch (e) {
    console.error('加载系列文章失败:', e)
    message.error('加载系列文章失败: ' + (e.message || '未知错误'))
    series.value = []
  } finally {
    isLoadingSeries.value = false
  }
}

const loadArticle = async (id) => {
  isLoading.value = true
  try {
    const res = await getArticle(id)
    if (res) {
      article.value = res.data
      isLiked.value = article.value.likeId >= 0
      authorInfo.value = {
        userId: article.value.userId,
        nickname: article.value.author,
        avatar: article.value.avatar,
        brief: article.value.brief,
        email: article.value.email,
      }
      await generateAnchors() // 生成目录锚点
      if (activeKey.value == 'series' && !article.value.seriesId) {
        activeKey.value = 'toc'
      }
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

// 监听tab切换，点击系列tab时加载系列文章
watch(
  () => activeKey.value,
  (newKey) => {
    if (newKey === 'series' && article.value.seriesId && series.value.length === 0) {
      loadSeries(article.value.seriesId)
    }
  }
)

// 初始加载
onBeforeMount(() => {
  loadArticle(props.id)
})

// 监听路由变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId != 0) {
      loadArticle(newId)
    }
  }
)

// 分享功能 - 仅复制链接
const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(curUrl)
    message.success('链接已复制到剪贴板')
  } catch (err) {
    message.error('复制链接失败: ' + (err.message || '未知错误'))
  }
}

// 处理点赞状态变化
const handleLikeChange = async (liked) => {
  try {
    // 登陆后才可操作
    if (!currentUser.value) {
      message.warning('请先登录')
      isLiked.value = !liked
      return
    }
    if (liked) {
      const res = await saveAction({
        type: 'LIKE',
        targetId: article.value.id,
      });
      article.value.likeId = res.data
      message.success('谢谢喜欢！');
      article.value.likeCount++;
    } else {
      await deleteAction('LIKE', article.value.likeId);
      message.info('已取消喜欢');
      article.value.likeId = -1
      article.value.likeCount--;
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    message.error('操作失败: ' + (error.message || '未知错误'));
    isLiked.value = !liked
  }
}

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
      // 添加重试逻辑，最多重试3次
      if (retryCount < 3) {
        // console.log(`尝试重试生成目录，当前重试次数: ${retryCount + 1}`);
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
@import '@/styles/variables.less';

.ant-btn {
  border-radius: 4px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
}

.article-status {
  position: absolute;
  top: 5px;
  right: 16vw;
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

    @media (max-width: @screen-md) {
      font-size: 1.7em;
    }
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
    line-height: 1.5rem;
    @media (max-width: @screen-md) {
      margin: 0 1rem;
    }
  }
}

.article-foot {
  padding: 0rem 2.5rem;

  @media (max-width: @screen-md) {
    padding: 0rem 1rem;
  }

  .article-foot-copyright {
    padding: 1em 1em;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    list-style: none;
  }

  .article-foot-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .article-foot-nav-prev,
  .article-foot-nav-next {
     width: 35%;
  }
  .article-foot-nav-next {
    text-align: right;
  }
}

.article-toc {
  background-color: #fff;
  position: sticky;
  top: 74px;
  z-index: 9;
  margin-right: 10px;
  max-width: 240px;
  left: 12%;

  @media (max-width: @screen-md) {
    top: 0;
    left: 6%;
  }

  .article-toc-content {
    padding: 0 10px 10px 5px;
  }

  .series-title {
    color: grey;
    font-size: 16px;
    text-align: center;
  }

  .current-article {
    font-weight: bold;
    cursor: default;
  }
}
</style>
