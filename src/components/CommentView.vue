<!-- 递归展示评论 -->
<template>
  <a-comment :author="data.username" :avatar="data.avatar">
    <template #actions>
      <span v-for="(action, index) in data.actions" :key="index" @click="emit('reply-click', data)">{{ action }}</span>
    </template>
    <template #content>
      {{ data.content }}
    </template>
    <template #datetime>
      <a-tooltip :title="data.created.format('YYYY-MM-DD HH:mm:ss')">
        <span>{{ data.created.fromNow() }}</span>
      </a-tooltip>
    </template>
    <CommentView
      v-for="child in data.children"
      :key="child.id"
      :data="child"
      @reply-click="emit('reply-click', child)"
    />
  </a-comment>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  data: Object,
})

const emit = defineEmits(['reply-click'])
</script>
