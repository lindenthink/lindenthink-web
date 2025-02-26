<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
    <!--<template #header>
      <a-form layout="inline">
        <a-form-item>
          <a-select
            v-model:value="tagFilter"
            mode="tags"
            style="width: 100%; min-width: 200px"
            placeholder="选择标签"
            :allowClear="true"
            :options="options"
          >
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-tree-select
            v-model:value="categoryFilter"
            show-search
            style="width: 100%; min-width: 200px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="选择分类"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
          >
          </a-tree-select>
        </a-form-item>
        <a-button shape="circle" html-type="submit">
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-form>
    </template>-->
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
            <router-link :to="{ path: `/list/article/${item.id}` }"> {{ item.title }} </router-link>
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
import type { SelectProps, TreeSelectProps } from 'ant-design-vue'

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

const tagFilter = ref([])
const options = ref<SelectProps['options']>([])

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i
  options.value!.push({
    label: `Label: ${value}`,
    value,
  })
}

const categoryFilter = ref(null)
const treeData = ref<TreeSelectProps['treeData']>([
  {
    title: 'parent 1',
    value: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1',
          },
          {
            title: 'your leaf',
            value: 'leaf2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
])
</script>

<style scoped lang="less">
:deep(.ant-list-pagination) {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 24px;
}
</style>
