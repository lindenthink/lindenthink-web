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
import ArticleList from '@/views/article/ArticleList.vue'
</script>
