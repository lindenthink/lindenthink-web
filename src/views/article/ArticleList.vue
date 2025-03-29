<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="articles" :loading="loading">
    <template #renderItem="{ item }">
      <a-list-item key="item.title">
        <a-list-item-meta>
          <template #description>
            <span>
              <EditOutlined style="margin-right: 8px" />
              菩提思
            </span>
            <a-divider type="vertical"></a-divider>
            <span>
              <CalendarOutlined style="margin-right: 8px" />
              {{ item.createTime }}
            </span>
          </template>
          <template #title>
            <router-link :to="{ path: `/articles/${item.id}` }"> {{ item.title }} </router-link>
          </template>
          <template #avatar><a-avatar :src="item.avatar" /></template>
        </a-list-item-meta>
        {{ item.description }}
        <template #actions>
          <span>
            <EyeOutlined style="margin-right: 8px" />
            {{ item.visitCount }}
          </span>
          <span>
            <LikeOutlined style="margin-right: 8px" />
            {{ item.phaiseCount }}
          </span>
          <span>
            <MessageOutlined style="margin-right: 8px" />
            {{ item.replyCount }}
          </span>
        </template>
        <template #extra>
          <img width="64" alt="logo" src="/logo.jpg" />
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
import { EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons-vue'
import { ref, onBeforeMount } from 'vue'
import { getArticles } from '@/services/articleService'

const articles = ref([])
const loading = ref(false)

const pagination = {
  onChange: async (page) => {
    handlePageChange(page)
  },
  pageSize: 5,
}

onBeforeMount(async () => {
  handlePageChange(1)
})

function handlePageChange(page) {
  loading.value = true
  getArticles({ page, pageSize: pagination.pageSize })
    .then((res) => {
      articles.value = res.data
      pagination.total = res.total
    })
    .catch((e) => {
      console.error(e)
      message.error(e.message || '加载失败')
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped lang="less">
:deep(.ant-list-pagination) {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 24px;
}
</style>
