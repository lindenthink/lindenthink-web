<template class="app">
  <!-- <AudioPlayer id="6991674483" /> -->
  <a-config-provider :locale="locale">
    <a-back-top :visibility-height="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 99%">
          <div>
            <img src="/logo.jpg" width="42" style="margin: 0 1.5em" />
            <img src="/title.png" width="130" />
          </div>
          <div class="menu-container">
            <a-menu
              v-if="!isMobile"
              v-model:selected-keys="currentMenu"
              mode="horizontal"
              :theme="theam"
              :style="{ fontSize: '16px' }"
            >
              <a-menu-item key="home">首页</a-menu-item>
              <a-menu-item key="articles">知识库</a-menu-item>
              <a-menu-item key="tools">工具箱</a-menu-item>
              <a-menu-item key="workbench">工作台</a-menu-item>
            </a-menu>
            <a-button v-else icon="menu" @click="drawerVisible = true" />
          </div>
          <a-input-search placeholder="搜索..." enter-button style="max-width: 300px" @search="onSearch" />
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
                  <a href="javascript:;" @click="handleLogout">退出</a>
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
  </a-config-provider>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useMediaQuery } from '@vueuse/core'
import WechatLogin from '@/components/WechatLogin.vue'
import { message } from 'ant-design-vue'

// import MyAudioPlayer from '@/components/common/AudioPlayer.vue'

const locale = zhCN
const theam = 'light'
const router = useRouter()
const currentMenu = ref(['/'])
const drawerVisible = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')
const showLoginModal = ref(false)
const userInfo = ref(null)
const isLoggedIn = ref(false)

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
    userInfo.value = JSON.parse(storedUser)
    isLoggedIn.value = true
  }
})
const onSearch = (value) => {
  console.log('搜索内容:', value)
}

const handleLoginSuccess = (loginUserInfo) => {
  isLoggedIn.value = true
  userInfo.value = loginUserInfo
  localStorage.setItem('userInfo', JSON.stringify(loginUserInfo))
  message.success(`欢迎回来，${loginUserInfo.nickname}`)
}

const handleLogout = () => {
  isLoggedIn.value = false
  userInfo.value = null
  localStorage.removeItem('userInfo')
  message.success('已退出登录')
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
  min-width: 1000px;
  flex: 1 1 55%;
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
  right: 15vw;
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
</style>
