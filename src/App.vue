<template class="app">
  <MyAudioPlayer id="6991674483" />
  <a-config-provider :locale="locale">
    <a-back-top visibilityHeight="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <a-menu v-model:selectedKeys="currentMenu" mode="horizontal" :theme="theam" style="z-index: 100">
          <a-menu-item key="home">
            <template #icon>
              <home-outlined />
            </template>
            首页
          </a-menu-item>
          <a-menu-item key="articles">
            <template #icon>
              <read-outlined />
            </template>
            文章
          </a-menu-item>
          <a-menu-item key="tools">
            <template #icon>
              <tool-outlined />
            </template>
            工具
          </a-menu-item>
          <a-menu-item key="bench">
            <template #icon>
              <schedule-outlined />
            </template>
            工作台
          </a-menu-item>
          <a-menu-item key="friends">
            <template #icon>
              <link-outlined />
            </template>
            友链
          </a-menu-item>
          <a-menu-item key="about">
            <template #icon>
              <idcard-outlined />
            </template>
            关于
          </a-menu-item>
        </a-menu>
      </a-layout-header>

      <a-layout-content :style="{ padding: '10px', marginTop: '64px', minWidth: '680px' }">
        <router-view :style="{ background: '#fff' }"> </router-view>
      </a-layout-content>

      <a-layout-footer :style="{ textAlign: 'center', margin: '36px 0 24px 0' }">
        菩提思 ©{{ year }} 版权所有
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { HomeOutlined, ReadOutlined, LinkOutlined, ToolOutlined, IdcardOutlined, ScheduleOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

import MyAudioPlayer from '@/components/MyAudioPlayer.vue'

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
const searchKey = ''
const onSearch = () => {}
const year = new Date().getFullYear()
</script>

<style lang="less" scoped>

:deep(.ant-layout) {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
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
  flex: 1 1 60%;
  transition: all 0.2s;
  min-width: 780px;
}

:deep(.ant-layout-header) {
  z-index: 100 !important;
  padding: 0;
}
:deep(.vuepress-markdown-body a) {
  color: #1890ff;
  font-weight: 400;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  -webkit-text-decoration-skip: objects;
  &:hover {
  text-decoration: none;
  color: #50a6f7;
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
  right: 15vw;
  bottom: 14vh;
  z-index: 10;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
