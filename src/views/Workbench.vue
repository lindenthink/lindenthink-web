<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-tabs v-model:activeKey="activeKey" animated>
        <a-tab-pane key="1" tab="待办事项">
          <TodoList />
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目管理">
          <GanttChart />
        </a-tab-pane>
      </a-tabs>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'

import TodoList from '@/views/work/TodoList.vue'
import GanttChart from '@/views/work/GanttChart.vue'
const activeKey = ref('1');
</script>

<style scoped lang="less">
.ant-tabs {
  margin: 10px 20px;
}
</style>