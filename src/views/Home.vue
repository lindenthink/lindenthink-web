<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-image :src="imgSrc" :preview="false" height="75vh" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const imgSrc = '/2.jpg'
</script>

<style scoped lang="less"></style>
