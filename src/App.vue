<template class="app">
  <!-- <MyAudioPlayer id="6991674483" /> -->
  <a-config-provider :locale="locale">
    <a-back-top visibilityHeight="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 99%">
          <div>
            <img src="/logo.jpg" width="48" style="margin: 0 1.5em" />
            <img src="/title.png" width="130" />
          </div>
          <a-menu v-model:selectedKeys="currentMenu" mode="horizontal" :theme="theam">
            <a-menu-item key="home"> 首页 </a-menu-item>
            <a-menu-item key="articles"> 文章 </a-menu-item>
            <a-menu-item key="tools"> 工具 </a-menu-item>
            <a-menu-item key="workbench"> 工作台 </a-menu-item>
            <a-menu-item key="about"> 关于 </a-menu-item>
          </a-menu>
          <a-input-search
            placeholder="搜索..."
            enter-button
            @search="onSearch"
            style="max-width: 300px; margin-right: 16px"
          />
          <a-avatar>
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </div>
      </a-layout-header>

      <a-layout-content :style="{ padding: '10px', marginTop: '64px', minWidth: '680px' }">
        <router-view :style="{ background: '#fff' }"> </router-view>
      </a-layout-content>

      <a-layout-footer :style="{ textAlign: 'center', margin: '36px 0 24px 0' }">
        <a href="mailto:844449541@qq.com">菩提思</a>©2023-{{ new Date().getFullYear() }}版权所有
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeOutlined,
  ReadOutlined,
  LinkOutlined,
  ToolOutlined,
  IdcardOutlined,
  ScheduleOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

// import MyAudioPlayer from '@/components/MyAudioPlayer.vue'

const locale = zhCN
const theam = 'light'
const router = useRouter()
const currentMenu: any = ref(['/'])

onMounted(() => {
  let pathname = location.pathname
  let routeName = pathname === '/' ? 'home' : pathname.replace('/', '')
  if (routeName.includes('/article')) {
    currentMenu.value = ['articles']
  } else {
    currentMenu.value = [routeName]
  }

  watch(currentMenu, (newValue: any, oldValue: any) => {
    let menu = newValue[0]
    router.push({ name: menu })
  })
})
const searchKey = ref('')
const onSearch = (value: string) => {
  console.log('搜索内容:', value)
}
</script>

<style lang="less" scoped>
:deep(.ant-layout) {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
}

:deep(.ant-layout-header) {
  background: #ffffff;
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

:deep(.ant-layout-content) {
  flex: 1 1 55%;
  transition: all 0.2s;
  min-width: 780px;
}

:deep(.ant-layout-header) {
  z-index: 100 !important;
  padding: 0;
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
</style>