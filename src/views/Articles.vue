<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-tabs v-model:activeKey="activeTab" style="padding: 0 5px;margin-left: 10px;">
        <a-tab-pane key="list" tab="全部"><article-list /></a-tab-pane>
        <a-tab-pane key="series" tab="系列">正在整理，敬请期待</a-tab-pane>
        <a-tab-pane key="category" tab="分类">正在整理，敬请期待</a-tab-pane>
        <a-tab-pane key="label" tab="标签">正在整理，敬请期待</a-tab-pane>
        <a-tab-pane key="archive" tab="归档"><article-archive /></a-tab-pane>
      </a-tabs>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleList from './articles/ArticleList.vue'
import ArticleArchive from './articles/ArticleArchive.vue'

const router = useRouter()
const activeTab = ref()
let queryParam: any = router.currentRoute.value.params
activeTab.value = !queryParam['tab'] ? 'list' : queryParam['tab']
</script>

<style scoped lang="less">
</style>
