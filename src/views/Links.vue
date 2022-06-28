<template>
  <a-list :grid="{ gutter: 15 }" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card hoverable style="width: 240px">
          <template #cover>
            <img alt="网站LOGO" src="/2.jpg" />
          </template>
          <a-card-meta title="菩提思" description="一花一世界，一叶一菩提">
            <template #avatar>
              <a-avatar src="/logo.jpg" />
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
const data = [1, 2, 3, 4]
</script>

<style scoped lang="less">
:deep(.ant-row) {
  background: #f0f2f5;
  justify-content: space-between;
}
</style>
