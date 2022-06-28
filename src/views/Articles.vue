<template>
  <a-tabs v-model:activeKey="activeTab" style="padding: 0 10px">
    <a-tab-pane key="list" tab="全部"><article-list /></a-tab-pane>
    <a-tab-pane key="series" tab="系列">Content of Tab Pane 2</a-tab-pane>
    <a-tab-pane key="archive" tab="归档"><article-archive /></a-tab-pane>
  </a-tabs>
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
:deep(.ant-list-pagination) {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 24px;
}
</style>
