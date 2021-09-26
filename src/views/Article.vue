<template class="article">
  <my-md-editor mode="edit" :content="content"></my-md-editor>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MyMdEditor from '@/components/MyMdEditor.vue'

const content = ref('')
</script>

<style scoped lang="less">
.article {
  // :v-deep
}
</style>
