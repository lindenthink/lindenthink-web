<!-- eslint-disable vue/no-v-html -->
<template class="app">
  <AudioPlayer v-if="audioPlayerEnabled" :id="playlistId" />
  <a-config-provider :locale="locale">
    <a-back-top :visibility-height="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 99%">
          <div>
            <img src="/title.png" width="130" style="margin: 0 1.5em" />
          </div>
          <div>
            <a-menu v-if="!isMobile" v-model:selected-keys="currentMenu" mode="horizontal" :theme="theam"
              :style="{ fontSize: '16px' }" @click="handleMenuClick">
              <a-menu-item key="home">首页</a-menu-item>
              <a-menu-item key="articles">文章</a-menu-item>
              <a-menu-item key="tools">工具</a-menu-item>
              <a-menu-item key="workbench">工作台</a-menu-item>
            </a-menu>
            <a-button v-else icon="menu" @click="drawerVisible = true" />
          </div>
          <div class="search-wrapper">
            <a-input-search v-model:value="searchKeyword" placeholder="搜索文章或工具..." style="max-width: 300px" allow-clear
              @search="handleSearch" @blur="handleSearchBlur" />
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
          <a-tooltip>
            <template #title>
              <span>写作</span>
            </template>
            <a-button v-if="isLoggedIn" shape="circle" @click="router.push('/articles/editor/0')"
              style="margin-right: 16px">
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-tooltip>
          <a-dropdown>
            <a style="margin-right: 2em" @click.prevent>
              <template v-if="!isLoggedIn">
                <a-avatar :size="32">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
              </template>
              <template v-else-if="userInfo?.avatar">
                <a-avatar :size="32" :src="userInfo.avatar" alt="用户头像" />
              </template>
              <template v-else>
                <a-avatar :size="32" style="background-color: #1890ff">
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
          <a-menu-item key="tools"> 工具 </a-menu-item>
          <a-menu-item key="workbench"> 工作台 </a-menu-item>
        </a-menu>
      </a-drawer>

      <a-layout-content :style="{ padding: '10px', marginTop: '64px' }">
        <router-view :style="{ background: '#fff' }"> </router-view>
      </a-layout-content>

      <a-layout-footer>
        <template v-if="!audioPlayerEnabled">
          <div>菩提思 ©2023-{{ new Date().getFullYear() }} 版权所有</div>
          <div>
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
          <a-switch v-model:checked="audioPlayerEnabled" size="small" />
        </div>
        <div class="setting-item">
          <span class="setting-label">网易云音乐列表ID</span>
          <a-input v-model:value="playlistId" placeholder="输入播放列表ID" :disabled="!audioPlayerEnabled" />
        </div>
      </div>
      
      <div class="setting-section">
        <h4>工作台配置</h4>
        <div class="setting-item">
          <span class="setting-label">自动同步待办</span>
          <a-switch v-model:checked="syncTodosEnabled" size="small" />
        </div>
        <div class="setting-item">
          <span class="setting-label">自动同步项目</span>
          <a-switch v-model:checked="syncProjectsEnabled" size="small" />
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
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, EditOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useMediaQuery, useDebounceFn } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import LoginForm from '@/components/LoginForm.vue'
import UserInfo from '@/components/UserInfo.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import { searchArticles } from '@/services/articleService'
import tools from '@/services/toolData'
import useTodos from '@/composables/useTodos'
import AudioPlayer from '@/components/AudioPlayer.vue'

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
const initialSettings = savedSettings ? JSON.parse(savedSettings) : {}
const audioPlayerEnabled = ref(
  initialSettings.audioPlayerEnabled !== undefined ? initialSettings.audioPlayerEnabled : false,
)
const playlistId = ref(initialSettings.audioPlayerId || '6991674483')
// 工作台同步设置
const syncTodosEnabled = ref(
  initialSettings.syncTodosEnabled !== undefined ? initialSettings.syncTodosEnabled : false,
)
const syncProjectsEnabled = ref(
  initialSettings.syncProjectsEnabled !== undefined ? initialSettings.syncProjectsEnabled : false,
)

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
  const settings = {
    audioPlayerEnabled: audioPlayerEnabled.value,
    audioPlayerId: playlistId.value,
    // 工作台同步设置
    syncTodosEnabled: syncTodosEnabled.value,
    syncProjectsEnabled: syncProjectsEnabled.value,
  }
  localStorage.setItem('systemSettings', JSON.stringify(settings))
  message.success('系统设置已保存')
  showSettingsDrawer.value = false
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.ant-layout {
  background: #f0f2f5 !important;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.ant-layout-header {
  background: #ffffff;
  min-width: 1000px;
  z-index: 10 !important;
  padding: 0;
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
}

:deep(.ant-layout-sider) {
  position: relative;
  min-width: 200px;
  max-width: 600px !important;
  opacity: 1;
  background: #f0f2f5;
  transition: all 0.2s;
  flex: 1 1 15% !important;
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
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 500px;
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
</style>
