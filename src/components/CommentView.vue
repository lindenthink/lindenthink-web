<!-- 递归展示评论 -->
<template>
  <a-comment :author="data.nickname">
    <template #actions>
      <span v-for="(action, index) in data.actions" :key="index" @click="emit('reply-click', data)">{{ action }}</span>
      <a-popconfirm title="确定要删除这条评论吗？" @confirm="() => emit('delete-click', data)" v-if="deletable">
        <span class="delete-btn">删除</span>
      </a-popconfirm>
    </template>
    <template #avatar>
      <UserCard :user-info="data">
        <template v-if="data?.avatar">
          <a-avatar :size="32" :src="data.avatar" alt="用户头像" style="cursor: pointer;" />
        </template>
        <template v-else>
          <a-avatar :size="32" :style="{ backgroundColor: getRandomColor(), color: '#fff' }" style="cursor: pointer;">
            {{ data?.nickname?.[0].toUpperCase() || 'U' }}
          </a-avatar>
        </template>
      </UserCard>
    </template>
    <template #content>
      {{ data.content }}
    </template>
    <template #datetime>
      <a-tooltip :title="data.created.format('YYYY-MM-DD HH:mm:ss')">
        <span>{{ data.created.fromNow() }}</span>
      </a-tooltip>
    </template>
    <CommentView v-for="child in data.children" :key="child.id" :data="child" :deletable="deletable" @reply-click="handleReplyClick" @delete-click="handleDeleteClick" />
  </a-comment>
</template>

<script setup>
import UserCard from '@/components/UserCard.vue'

defineProps({
  data: Object,
  deletable: Boolean,
})

const emit = defineEmits(['reply-click', 'delete-click'])

// 生成随机柔和颜色
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 10); // 45-55%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const handleReplyClick = (item) => {
  emit('reply-click', item)
}

const handleDeleteClick = (item) => {
  emit('delete-click', item)
}

</script>

<style scoped lang="less">
.delete-btn {
  color: #fa5659;
  &:hover {
    color: #f81a25;
  }
  cursor: pointer;
}
</style>
