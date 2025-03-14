<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <ArticleList />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleList from '@/views/article/ArticleList.vue'
const router = useRouter()

</script>

<style scoped lang="less">
</style>
