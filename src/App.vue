<!-- eslint-disable vue/no-v-html -->
<template class="app">
  <!-- <AudioPlayer id="6991674483" /> -->
  <a-config-provider :locale="locale">
    <a-back-top :visibility-height="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 99%">
          <div>
            <!-- <img src="/logo.jpg" width="42" style="margin: 0 1.5em" /> -->
            <img src="/title.png" width="130" style="margin: 0 1.5em" />
          </div>
          <div>
            <a-menu
              v-if="!isMobile"
              v-model:selected-keys="currentMenu"
              mode="horizontal"
              :theme="theam"
              :style="{ fontSize: '16px' }"
            >
              <a-menu-item key="home">首页</a-menu-item>
              <a-menu-item key="articles">文章</a-menu-item>
              <a-menu-item key="tools">工具</a-menu-item>
              <a-menu-item key="workbench">工作台</a-menu-item>
            </a-menu>
            <a-button v-else icon="menu" @click="drawerVisible = true" />
          </div>
          <div class="search-wrapper">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索文章或工具..."
              style="max-width: 300px"
              allow-clear
              @search="handleSearch"
              @focus="showResults = true"
              @blur="handleSearchBlur"
            />
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
          <a-dropdown>
            <a style="margin-right: 2em" @click.prevent>
              <a-avatar v-if="!userInfo?.avatar" :size="40">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <a-avatar v-else :size="40" :src="userInfo.avatar" alt="用户头像" />
              <span v-if="userInfo?.nickname" class="nickname">{{ userInfo.nickname }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item :disabled="isLoggedIn">
                  <a href="javascript:;" @click="showLoginModal = true">扫码登录</a>
                </a-menu-item>
                <a-menu-item :disabled="!isLoggedIn">
                  <a href="javascript:;" @click="showSettingsModal = true">系统设置</a>
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
        <a-menu v-model:selected-keys="currentMenu" mode="vertical" :theme="theam">
          <a-menu-item key="home"> 首页 </a-menu-item>
          <a-menu-item key="articles"> 知识库 </a-menu-item>
          <a-menu-item key="tools"> 百宝箱 </a-menu-item>
          <a-menu-item key="workbench"> 工作台 </a-menu-item>
        </a-menu>
      </a-drawer>

      <a-layout-content :style="{ padding: '10px', marginTop: '64px', minWidth: '680px' }">
        <router-view :style="{ background: '#fff' }"> </router-view>
      </a-layout-content>

      <a-layout-footer :style="{ textAlign: 'center' }">
        <div>菩提思 ©2023-{{ new Date().getFullYear() }} 版权所有</div>
        <div>
          <a href="/about" target="_blank">关于本站</a>
          <a-divider type="vertical" />
          <a href="/friends" target="_blank">友情链接</a>
        </div>
      </a-layout-footer>
    </a-layout>
    <WechatLogin v-model:visible="showLoginModal" @login-success="handleLoginSuccess" />

    <SystemSettings v-model:visible="showSettingsModal" />
  </a-config-provider>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useMediaQuery, useDebounceFn } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

import WechatLogin from '@/components/WechatLogin.vue'
import SystemSettings from '@/components/SystemSettings.vue'

// import MyAudioPlayer from '@/components/common/AudioPlayer.vue'

const locale = zhCN
const theam = 'light'
const router = useRouter()
const currentMenu = ref(['/'])
const drawerVisible = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')
const showLoginModal = ref(false)

const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
const showSettingsModal = ref(false)

const searchKeyword = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const showResults = ref(false)

onMounted(() => {
  const pathname = location.pathname
  const routeName = pathname === '/' ? 'home' : pathname.replace('/', '')
  if (routeName.includes('articles')) {
    currentMenu.value = ['articles']
  } else if (routeName.includes('tools')) {
    currentMenu.value = ['tools']
  } else {
    currentMenu.value = [routeName]
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(currentMenu, (newValue, oldValue) => {
    const menu = newValue[0]
    router.push({ name: menu })
  })

  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    userStore.login(JSON.parse(storedUser))
  }
})

const handleLoginSuccess = (loginUserInfo) => {
  userStore.login(loginUserInfo)
  message.success(`欢迎回来，${loginUserInfo.nickname}`)
}

const handleLogout = () => {
  userStore.logout()
  message.success('已退出登录')
}

const debouncedSearch = useDebounceFn(async (keyword) => {
  if (!keyword) {
    searchResults.value = []
    return
  }
  try {
    searchLoading.value = true
    // 模拟调用接口延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // 模拟数据
    searchResults.value = [
      {
        id: '1',
        type: 'article',
        title: 'Vue3使用指南',
        description: '最新Vue3特性详解',
        route: '/articles/2',
      },
      {
        id: '2',
        type: 'article',
        title: 'Vue3使用指南',
        description: '最新Vue3特性详解',
        route: '/articles/2',
      },
      {
        id: '3',
        type: 'article',
        title: 'Vue3使用指南',
        description: '最新Vue3特性详解',
        route: '/articles/2',
      },
      {
        id: '4',
        type: 'article',
        title: 'Vue3使用指南',
        description: '最新Vue3特性详解',
        route: '/articles/2',
      },
      {
        id: '5',
        type: 'article',
        title: 'Vue3使用指南',
        description: '最新Vue3特性详解',
        route: '/articles/2',
      },
      {
        id: 'code-formatter',
        type: 'tool',
        title: '代码格式化工具',
        description: '在线代码格式化工具',
        route: '/tools/code-formatter',
      },
    ]
  } finally {
    searchLoading.value = false
  }
}, 500)
const handleSearch = (value) => {
  searchKeyword.value = value
  debouncedSearch(value)
}
const handleSearchBlur = () => {
  if (!showResults.value) return
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
const goToSearchResult = (item) => {
  if (item.type === 'article') {
    router.push({ name: 'articles', query: { keyword: item.title } })
  } else if (item.type === 'tool') {
    router.push({ name: 'tools', query: { keyword: item.title } })
  }
}

// 计算属性分类结果
const resultCategories = computed(() => {
  if (!searchResults.value.length) return {}
  return {
    article: searchResults.value.filter((item) => item.type === 'article'),
    tool: searchResults.value.filter((item) => item.type === 'tool'),
  }
})

// 监听输入变化
watch(searchKeyword, (val) => {
  if (val) {
    showResults.value = true
    debouncedSearch(val)
  } else {
    searchResults.value = []
  }
})

const highlightKeywords = (text, keyword) => {
  if (!text || !keyword) return text
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
</script>

<style lang="less" scoped>
.ant-layout {
  position: relative;
  background: #f0f2f5 !important;
  transition: all 0.2s;
}

.ant-layout-header {
  background: #ffffff;
  min-width: 1000px;
  z-index: 10 !important;
  padding: 0;
}

:deep(.ant-layout-content) {
  position: relative;
  min-width: 0;
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
  flex: 1 1 20% !important;
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
  right: 20vw;
  bottom: 14vh;
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
  top: 40px; // 根据搜索框高度调整
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
  padding: 10px 0;
}
</style>
