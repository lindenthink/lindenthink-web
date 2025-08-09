<!-- 递归展示评论 -->
<template>
  <a-comment :author="data.nickname">
    <template #actions>
      <span v-for="(action, index) in data.actions" :key="index" @click="emit('reply-click', data)">{{ action }}</span>
    </template>
    <template #avatar>
      <template v-if="data?.avatar">
        <a-avatar :size="32" :src="data.avatar" alt="用户头像" />
      </template>
      <template v-else>
        <a-avatar :size="32" :style="{ backgroundColor: getRandomColor(), color: '#fff' }">
          {{ data?.nickname?.[0].toUpperCase() || 'U' }}
        </a-avatar>
      </template>
    </template>
    <template #content>
      {{ data.content }}
    </template>
    <template #datetime>
      <a-tooltip :title="data.created.format('YYYY-MM-DD HH:mm:ss')">
        <span>{{ data.created.fromNow() }}</span>
      </a-tooltip>
    </template>
    <CommentView v-for="child in data.children" :key="child.id" :data="child"
      @reply-click="emit('reply-click', child)" />
  </a-comment>
</template>

<script setup>
// 生成随机柔和颜色
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 10); // 45-55%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

defineProps({
  data: Object,
})

const emit = defineEmits(['reply-click'])
</script>
