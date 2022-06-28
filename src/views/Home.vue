<template>
  <!-- <div class="home"> -->
  <a-image :src="imgSrc" :preview="false" height="75vh" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const imgSrc = '/2.jpg'
</script>

<style scoped lang="less">
.home {
  height: 100vh;
}
</style>
