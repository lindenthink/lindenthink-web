<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
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
            <router-link :to="{ path: `/article/${item.id}` }"> {{ item.title }} </router-link>
          </template>
          <template #avatar><a-avatar :src="item.avatar" /></template>
        </a-list-item-meta>
        {{ item.description }}
        <template #actions>
          <span>
            <EyeOutlined style="margin-right: 8px" />
            {{ item.starCount }}
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
          <img width="64" alt="logo" src="logo.jpg" />
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons-vue'

const listData: Record<string, any>[] = []

for (let i = 0; i < 50; i++) {
  listData.push({
    id: i,
    title: `ant design vue part ${i}`,
    avatar: `/logo.jpg`,
    description:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    createTime: '2022-05-20',
    starCount: 300,
    phaiseCount: 120,
    replyCount: 5,
  })
}
const pagination = {
  onChange: (page: number) => {
    console.log(page)
  },
  showQuickJumper: true,
  pageSize: 5,
}

</script>

<style scoped lang="less">
:deep(.ant-list-pagination) {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 24px;
}
</style>
