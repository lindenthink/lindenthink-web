<!-- eslint-disable vue/no-v-html -->
<template class="app">
  <AudioPlayer v-if="systemSettings.audioPlayerEnabled" :id="playlistId" />
  <a-config-provider :locale="locale">
    <a-back-top :visibility-height="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="header-container">
          <div>
            <a-button v-if="isMobile" @click="drawerVisible = true" type="text"> 
              <MenuOutlined />
            </a-button>
            <img src="/title.png" :width="isMobile ? 80: 130" style="margin: 0 1.5em" />
          </div>
          <div>
            <a-menu v-if="!isMobile" v-model:selected-keys="currentMenu" mode="horizontal" :theme="theam"
              :style="{ fontSize: '16px' }" @click="handleMenuClick">
              <a-menu-item key="home">首页</a-menu-item>
              <a-menu-item key="articles">文章</a-menu-item>
              <a-menu-item key="tools">工具</a-menu-item>
              <a-menu-item key="workbench">工作台</a-menu-item>
            </a-menu>
          </div>
          <div class="search-wrapper" v-if="!isMobile">
            <a-input-search v-model:value="searchKeyword" placeholder="搜索文章或工具..." allow-clear
              @search="handleSearch" @blur="handleSearchBlur" :maxlength="20" />
            <div v-if="showResults" class="search-results">
              <a-spin v-if="searchLoading" />
              <template v-else>
                <div v-if="searchResults.length === 0" class="empty-tips">暂无相关结果</div>
                <div v-for="(section, type) in resultCategories" v-else :key="type" class="result-section">
                  <div class="section-title">{{ type === 'article' ? '文章' : '工具' }}</div>
                  <a-list item-layout="horizontal" :data-source="section">
                    <template #renderItem="{ item }">
                      <a-list-item @click="goToSearchResult(item)">
                        <a-list-item-meta>
                          <template #title>
                            <a v-html="highlightKeywords(item.title, searchKeyword)" />
                          </template>
                          <template #description>
                            <span v-html="highlightKeywords(item.description, searchKeyword)" />
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </div>
              </template>
            </div>
          </div>
          <!-- 系统消息轮播区域 -->
          <div v-if="systemMessages.length > 0 && !isMobile" class="system-message-banner">
            <div class="message-carousel" ref="messageCarousel">
              <a-alert 
                v-for="(msg, index) in systemMessages" 
                :key="msg.id"
                :message="msg.content"
                :type="'info'"
                :closable="false"
                :showIcon="false"
                class="system-message-alert"
                :style="{ transform: `translateY(${index === currentSystemMessageIndex ? 0 : 100}%)` }"
              />
            </div>
          </div>
          <div v-if="isLoggedIn && !isMobile" style="min-width: 120px;">
            <a-tooltip>
              <template #title>
                <span>写作</span>
              </template>
              <a-button shape="circle" @click="router.push('/articles/editor/0')" style="margin-right: 16px"
                class="writing-button" size="large" >
                <template #icon>
                  <icon-font type="icon-xiezuo" />
                </template>
              </a-button>
            </a-tooltip>
            <!-- 消息通知按钮 -->
            <a-dropdown>
              <a-badge :count="unreadMessageCount" :offset="[-20, 0]">
              <a-button shape="circle" style="margin-right: 16px; position: relative;"
                :class="{ 'has-notification': unreadMessageCount > 0 }" size="large" >
                <BellOutlined />
              </a-button>
              </a-badge>
              <template #overlay>
                <div class="message-dropdown-container">
                  <div v-if="userMessages.length === 0" class="empty-message">
                      暂无消息通知
                    </div>
                    <template v-else>
                      <div v-for="msg in userMessages" :key="msg.id" :class="['message-item', { 'unread': !msg.isRead }]">
                        <div class="message-content-wrapper">
                          <div v-if="msg.url" @click.stop="handleMessageClick(msg)" class="message-content-link">
                            {{ msg.content }}
                          </div>
                          <div v-else class="message-content-text">
                            {{ msg.content }}
                          </div>
                          <div class="message-footer">
                            <div class="message-time">
                              {{ msg.createTime.fromNow() }}
                            </div>
                            <a-button v-if="!msg.isRead" size="small" type="text" class="mark-read-button"
                              @click.stop="markMessageAsRead(msg)">
                              已读
                            </a-button>
                          </div>
                        </div>
                      </div>
                    </template>
                </div>
              </template>
            </a-dropdown>
          </div>
          <a-dropdown>
            <a class="user-dropdown" @click.prevent>
              <template v-if="!isLoggedIn">
                <a-avatar :size="isMobile ? 32 : 40">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
              </template>
              <template v-else-if="userInfo?.avatar">
                <a-avatar :size="isMobile ? 32 : 40" :src="userInfo.avatar" alt="用户头像" />
              </template>
              <template v-else>
                <a-avatar :size="isMobile ? 32 : 40" style="background-color: #1890ff">
                  {{ userInfo?.username?.[0].toUpperCase() || 'U' }}
                </a-avatar>
              </template>
              <span v-if="userInfo?.nickname" class="nickname">{{ userInfo.nickname }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item :disabled="isLoggedIn">
                  <a href="javascript:;" @click="showLoginModal = true">注册登录</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item :disabled="!isLoggedIn">
                  <a href="javascript:;" @click="showUserInfoModal = true">用户信息</a>
                </a-menu-item>
                <!-- 添加系统设置菜单项 -->
                <a-menu-item @click="showSettingsDrawer = true">
                  <a href="javascript:;">系统设置</a>
                </a-menu-item>
                <a-menu-item :disabled="!isLoggedIn">
                  <a href="javascript:;" @click="showChangePasswordModal = true">修改密码</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item :disabled="!isLoggedIn">
                  <a href="javascript:;" @click="handleLogout">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-drawer v-model:visible="drawerVisible" placement="left" :width="250">
        <a-menu v-model:selected-keys="currentMenu" mode="vertical" :theme="theam" @click="handleMenuClick">
          <a-menu-item key="home"> 首页 </a-menu-item>
          <a-menu-item key="articles"> 文章 </a-menu-item>
          <a-menu-item key="about"> 关于 </a-menu-item>
        </a-menu>
      </a-drawer>

      <a-layout-content :style="{ padding: '10px', marginTop: '64px' }">
        <router-view :style="{ background: '#fff' }"> </router-view>
      </a-layout-content>

      <a-layout-footer>
        <template v-if="!systemSettings.audioPlayerEnabled">
          <div>菩提思 ©2023-{{ new Date().getFullYear() }} 版权所有</div>
          <div v-if="!isMobile">
            <a href="/about" target="_blank">关于本站</a>
            <a-divider type="vertical" />
            <a href="/friends" target="_blank">友情链接</a>
          </div>
        </template>
      </a-layout-footer>
    </a-layout>
    <LoginForm v-model:visible="showLoginModal" @login-success="handleLoginSuccess" />
    <UserInfo v-model:visible="showUserInfoModal" />
    <ChangePassword v-model:visible="showChangePasswordModal" />
    <!-- 系统设置Drawer -->
    <a-drawer v-model:visible="showSettingsDrawer" title="系统设置" placement="right" :width="350">
      <div class="setting-section">
        <h4>音频播放器设置</h4>
        <div class="setting-item">
          <span class="setting-label">启用音乐播放器</span>
          <a-switch v-model:checked="systemSettings.audioPlayerEnabled" size="small" />
        </div>
        <div class="setting-item">
          <span class="setting-label">网易云音乐列表ID</span>
          <a-input v-model:value="systemSettings.audioPlayerId" placeholder="输入播放列表ID"
            :disabled="!systemSettings.audioPlayerEnabled" />
        </div>
      </div>

      <div class="setting-section">
        <h4>工作台配置</h4>
        <div class="setting-item">
          <span class="setting-label">自动同步待办</span>
          <a-switch v-model:checked="systemSettings.syncTodosEnabled" size="small" />
        </div>
        <div class="setting-item">
          <span class="setting-label">自动同步项目</span>
          <a-switch v-model:checked="systemSettings.syncProjectsEnabled" size="small" />
        </div>
      </div>

      <div class="drawer-actions">
        <a-button @click="showSettingsDrawer = false" size="small">取消</a-button>
        <a-button type="primary" @click="saveSettings" size="small">保存</a-button>
      </div>
    </a-drawer>
  </a-config-provider>
</template>

<script setup>
import { onMounted, ref, watch, computed, reactive, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, BellOutlined, MenuOutlined, createFromIconfontCN } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useMediaQuery, useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import LoginForm from '@/components/LoginForm.vue'
import UserInfo from '@/components/UserInfo.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import { searchArticles } from '@/services/articleService'
import tools from '@/services/toolData'
import useTodos from '@/composables/useTodos'
import { queryActionsByType, saveAction } from '@/services/actionService'

const AudioPlayer = defineAsyncComponent(() => import('@/components/AudioPlayer.vue'))

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_5014425_5vgj3xdawbb.js',
});

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const locale = zhCN
const theam = 'light'
const router = useRouter()
const currentMenu = ref(['/'])
const drawerVisible = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')
const showLoginModal = ref(false)
const showChangePasswordModal = ref(false)

const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
const showUserInfoModal = ref(false)

const searchKeyword = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const showResults = ref(false)

// 系统设置相关变量
const showSettingsDrawer = ref(false)
const savedSettings = localStorage.getItem('systemSettings')
const systemSettings = reactive(savedSettings ? JSON.parse(savedSettings) : {
  audioPlayerEnabled: false,
  audioPlayerId: '6991674483',
  syncTodosEnabled: false,
  syncProjectsEnabled: false,
})

// 消息通知相关变量
const unreadMessageCount = ref(0) // 未读消息数量
const messages = ref([]) // 消息列表
const systemMessagesInterval = ref(null) // 系统消息轮播定时器

// 计算属性：系统消息列表(userId=-1)
const systemMessages = computed(() => {
  return messages.value.filter(msg => msg.userId === -1)
})

// 计算属性：用户消息列表(userId!=-1)
const userMessages = computed(() => {
  return messages.value.filter(msg => msg.userId !== -1)
})

// 当前轮播的系统消息索引
const currentSystemMessageIndex = ref(0)

onMounted(() => {
  // 监听路由变化
  router.afterEach((to, from) => {
    const pathname = location.pathname
    const routeName = pathname === '/' ? 'home' : pathname.replace('/', '')
    if (routeName.includes('articles')) {
      currentMenu.value = ['articles']
    } else if (routeName.includes('tools')) {
      currentMenu.value = ['tools']
    } else {
      currentMenu.value = [routeName]
    }
  })

  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    userStore.login(JSON.parse(storedUser))
  }
  // 初始化待办事项通知服务
  useTodos()

  // 初始化消息通知
  if (isLoggedIn.value) {
    initMessages()
  }
})

const handleMenuClick = ({ key }) => {
  router.push({ name: key })
  // 在移动设备上，点击菜单后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false
  }
}

const handleLoginSuccess = (loginUserInfo) => {
  userStore.login(loginUserInfo)
  message.success(`欢迎回来，${loginUserInfo.nickname}`)
  window.location.reload()
}

const handleLogout = () => {
  userStore.logout()
  message.success('已退出登录')
  window.location.reload()
}

// 初始化消息通知
async function initMessages() {
  await fetchMessages()
  // 定时检查新消息
  setInterval(async () => {
    if (isLoggedIn.value) {
      await fetchMessages()
    }
  }, 60000)
  
  // 启动系统消息轮播
  startSystemMessagesCarousel()
}

// 启动系统消息轮播
function startSystemMessagesCarousel() {
  if (systemMessagesInterval.value) {
    clearInterval(systemMessagesInterval.value)
  }
  
  systemMessagesInterval.value = setInterval(() => {
    if (systemMessages.value.length > 1) {
      currentSystemMessageIndex.value = 
        (currentSystemMessageIndex.value + 1) % systemMessages.value.length
    }
  }, 5000) // 5秒切换一次
}

// 停止系统消息轮播
function stopSystemMessagesCarousel() {
  if (systemMessagesInterval.value) {
    clearInterval(systemMessagesInterval.value)
    systemMessagesInterval.value = null
  }
}

async function fetchMessages() {
  try {
    const res = await queryActionsByType('MESSAGE')
    messages.value = res.data.map(item => ({
      ...JSON.parse(item.content),
      id: item.id,
      url: item.url,
      createTime: dayjs(item.created),
      userId: item.userId
    })) || []
    unreadMessageCount.value = messages.value.filter(msg => !msg.isRead).length
  } catch (error) {
    console.error('获取未读消息失败:', error)
    message.error('获取未读消息失败')
    }
  }

  // 监听系统消息变化，重新启动轮播
  watch(systemMessages, (newMessages) => {
    if (newMessages.length > 0) {
      startSystemMessagesCarousel()
    } else {
      stopSystemMessagesCarousel()
    }
  }, { deep: true })
  
  async function markMessageAsRead(message) {
  try {
    message.isRead = true
    await saveAction({
      id: message.id,
      type: 'MESSAGE',
      content: JSON.stringify({
        content: message.content,
        isRead: true,
      }),
    })
    unreadMessageCount.value = messages.value.filter(msg => !msg.isRead).length
  } catch (error) {
    console.error('标记消息为已读失败:', error)
    message.error('标记消息为已读失败')
  }
}

function handleMessageClick(message) {
  if (!message.isRead) {
    markMessageAsRead(message)
  }
  if (message.url) {
    router.push(message.url)
  }
}

const debouncedSearch = useDebounceFn(async (keyword) => {
  if (!keyword) {
    searchResults.value = []
    return
  }
  try {
    searchLoading.value = true
    // 清空之前的搜索结果
    searchResults.value = []

    // 1. 调用接口查询文章
    const articleResults = await searchArticles(keyword)
    const formattedArticles = articleResults?.data?.map(article => ({
      id: article.id,
      type: 'article',
      title: article.title,
      description: article.excerpt || '暂无描述',
      route: `/articles/${article.id}`
    })) || []

    // 2. 从toolData中获取匹配的工具
    const toolResults = []
    tools.forEach(category => {
      category.children.forEach(tool => {
        // 检查工具标题、快速名称或搜索关键词是否匹配
        const isMatch =
          tool.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (tool.quickName && tool.quickName.toLowerCase().includes(keyword.toLowerCase())) ||
          (tool.searchKey && tool.searchKey.toLowerCase().includes(keyword.toLowerCase()))

        if (isMatch) {
          toolResults.push({
            id: tool.path,
            type: 'tool',
            title: tool.title,
            description: `工具: ${category.title} - ${tool.title}`,
            route: tool.path
          })
        }
      })
    })

    // 3. 合并搜索结果并限制数量
    searchResults.value = [...formattedArticles, ...toolResults].slice(0, 20)
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败，请稍后再试')
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}, 500)

const handleSearch = (value) => {
  if (!value) return
  searchKeyword.value = value
  searchResults.value = []
  searchLoading.value = true // 提前设置为搜索中状态
  showResults.value = true
  debouncedSearch(value)
}

const handleSearchBlur = () => {
  if (!showResults.value) return
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const goToSearchResult = (item) => {
  router.push(item.route)
}

// 计算属性分类结果
const resultCategories = computed(() => {
  if (!searchResults.value.length) return {}
  // 为空时则不展示对应分类
  const categories = {}
  if (searchResults.value.some((item) => item.type === 'article')) {
    categories.article = searchResults.value.filter((item) => item.type === 'article')
  }
  if (searchResults.value.some((item) => item.type === 'tool')) {
    categories.tool = searchResults.value.filter((item) => item.type === 'tool')
  }
  return categories
})

// 监听输入变化
watch(searchKeyword, (val) => {
  if (val && val.trim().length > 1) {
    searchLoading.value = true // 提前设置为搜索中状态
    showResults.value = true
    debouncedSearch(val)
  } else {
    showResults.value = false
    searchResults.value = []
  }
})

const highlightKeywords = (text, keyword) => {
  if (!text || !keyword) return text
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 保存系统设置
const saveSettings = () => {
  localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
  message.success('系统设置已保存')
  showSettingsDrawer.value = false
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

:deep(.ant-layout) {
  background: #f0f2f5 !important;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  width: 100%;
}

.ant-layout-header {
  background: #ffffff;
  min-width: 1000px;
  z-index: 10 !important;
  padding: 0;
  
  // 响应式调整
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 8px;
    min-width: 0;
  }
}

:deep(.ant-layout-content) {
  position: relative;
  background: #ffffff;
  transition: all 0.2s;
  min-width: 900px;
  flex: 1 1 50%;
  margin: 10px;
  border-radius: 5px;
  padding: 0 !important;
  
  // 响应式调整
  @media (max-width: 768px) {
    margin: 4px;
    padding: 0 !important;
    min-width: 0;
  }
}

:deep(.ant-layout-sider) {
  position: relative;
  min-width: 0;
  max-width: 600px !important;
  opacity: 1;
  background: #f0f2f5;
  transition: all 0.2s;
  flex: 1 1 15% !important;

  @media (max-width: 768px) {
    margin: 0px;
    padding: 0 !important;
    max-width: 0px !important;
  }
}

.ant-back-top {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: 'tnum';
  position: fixed;
  right: 18vw;
  bottom: 20vh;
  z-index: 10;
  width: 40px;
  height: 40px;
  cursor: pointer;
  
  // 响应式调整
  @media (max-width: 768px) {
    right: 20px;
    bottom: 60px;
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
}

.user-dropdown {
  margin-right: 2em;
  min-width: 140px;
  @media (max-width: 768px) {
    margin-right: 1em;
    min-width: 80px;
  }
}

.ant-avatar {
  transition: all 0.3s;

  img {
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.1);
  }
}

// 禁用状态样式
.ant-menu-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;

  a {
    color: inherit !important;
  }
}

.nickname {
  margin-left: 8px;
  color: #555;
  font-weight: 600;
  // 响应式调整
  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 200px;
  min-width: 200px;
  margin: 0 20px;
  display: flex;
  align-items: center; // 新增垂直居中
}

.search-results {
  padding: 0 0 10px 10px;
  position: absolute;
  top: 52px; // 根据搜索框高度调整
  left: 50%;
  transform: translateX(-50%);
  z-index: 1050; // 高于头部z-index
  width: 500px;
  max-height: 60vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);

  // 移动端适配
  @media (max-width: 768px) {
    width: 90vw;
    left: 5vw;
    transform: none;
    top: 48px;
  }

  .empty-tips {
    padding: 20px;
    color: #999;
    text-align: center;
  }

  .result-section {
    .section-title {
      font-weight: 600;
      color: #1890ff;
      padding: 0px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 8px;
    }

    .ant-list-item {
      padding: 5px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #fafafa;
      }
    }
  }
}

:deep(.ant-list-item-meta) {
  .highlight {
    color: #e94117;
    font-weight: 500;
    background-color: rgba(24, 144, 255, 0.1);
    padding: 0 2px;
    border-radius: 2px;
  }

  // 允许描述字段换行
  &-description {
    white-space: pre-wrap;
  }
}

:deep(.ant-layout-footer) {
  width: 100%;
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
  transition: all 0.3s;
}

.ant-divider-vertical {
    border-left: 1px solid #d0dadf;
  }

  /* 系统消息轮播样式 */
  .system-message-banner {
    position: relative;
    flex: 1;
    max-width: 360px;
    min-width: 240px;
    margin: 0 20px;
    overflow: hidden;
    height: 36px;
  }

  .message-carousel {
    position: relative;
    height: 100%;
  }

  .system-message-alert {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 4px 16px;
    margin: 0;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 16px;
    box-shadow: none;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    opacity: 0;
  }

  .system-message-alert[style*="translateY(0%)"] {
    opacity: 1;
  }

.setting-section {
  margin-bottom: 20px;

  h4 {
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 1000;
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;

  .setting-label {
    color: rgba(128, 122, 122, 0.85);
    font-size: 13px;
    display: inline-block;
    width: 200px;
  }

  &:last-child {
    border-bottom: none;
  }
}

.drawer-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

/* 消息通知样式 */
.has-notification {
  animation: notification-pulse 2s infinite;
}

/* 消息下拉框样式 */
.message-dropdown-container {
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 14px;
}

/* 空消息提示 */
.empty-message {
  text-align: center;
  padding: 16px;
  color: #999;
}

/* 消息项样式 */
.message-item {
  padding: 12px;
  margin-bottom: 0;
  border-radius: 6px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &.unread {
    background-color: #e6f7ff;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
}

/* 消息内容容器 */
.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 有URL的消息内容 */
.message-content-link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}

/* 无URL的消息内容 */
.message-content-text {
  word-wrap: break-word;
  cursor: default;
}

/* 消息底部 */
.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

/* 消息时间 */
.message-time {
  font-size: 12px;
  color: #999;
}

/* 已读按钮 */
.mark-read-button {
  font-size: 12px;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  padding: 2px 10px;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
    color: #fff;
  }
}

@keyframes notification-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }

  70% {
    box-shadow: 0 0 0 8px rgba(24, 144, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

</style>
