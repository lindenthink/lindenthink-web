<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  useRouter().push('article')
})
</script>

<style lang="less" scoped></style>