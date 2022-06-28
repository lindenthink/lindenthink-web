<template class="app">
  <my-audio-player />
  <a-config-provider :locale="locale">
    <a-back-top visibilityHeight="200" />
    <a-layout>
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="logo"></div>
        <a-menu v-model:selectedKeys="currentMenu" mode="horizontal" :theme="theam" style="z-index: 100">
          <a-menu-item key="/">
            <template #icon>
              <home-outlined />
            </template>
            首页
          </a-menu-item>
          <!-- <a-sub-menu>
            <template #icon>
              <read-outlined />
            </template>
            <template #title>文章</template>
            <a-menu-item key="articles">列表</a-menu-item>
            <a-menu-item key="series">系列</a-menu-item>
            <a-menu-item key="categories">分类</a-menu-item>
            <a-menu-item key="archive ">归档</a-menu-item>
          </a-sub-menu> -->
          <a-menu-item key="articles">
            <template #icon>
              <read-outlined />
            </template>
            文章
          </a-menu-item>
          <a-menu-item key="tools">
            <template #icon>
              <gift-outlined />
            </template>
            工具
          </a-menu-item>
          <a-menu-item key="links">
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

      <a-layout>
        <a-layout-sider>
          <a-anchor>
            <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo with Target" target="_blank" />
            <a-anchor-link href="#API" title="API">
              <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
              <a-anchor-link href="#Link-Props" title="Link Props" />
            </a-anchor-link>
          </a-anchor>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '10px', marginTop: '64px', minWidth: '680px' }">
          <router-view :style="{ background: '#fff' }"> </router-view>
        </a-layout-content>
        <a-layout-sider>
        
        </a-layout-sider>
      </a-layout>

      <a-layout-footer :style="{ textAlign: 'center', margin: '36px 0 24px 0' }">
        菩提思 ©{{ year }} 版权所有
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { HomeOutlined, ReadOutlined, LinkOutlined, GiftOutlined, IdcardOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

import MyAudioPlayer from './components/MyAudioPlayer.vue'

const locale = zhCN
const theam = 'dark'
const router = useRouter()
const currentMenu: any = ref(['/'])
watch(currentMenu, (newValue: any, oldValue: any) => {
  let menu = newValue[0] === '/' ? '' : newValue[0]
  router.push(`/${menu}`)
})
const searchKey = ''
const onSearch = () => {}
const year = new Date().getFullYear()

</script>

<style lang="less" scoped>
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

:deep(.ant-layout) {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
}

:deep(.ant-layout-sider) {
  position: relative;
  min-width: 0;
  opacity: 1;
  background: #f0f2f5;
  transition: all 0.2s;
}

:deep(.ant-layout-header) {
  z-index: 100 !important;
}
</style>
