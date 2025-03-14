<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-tabs v-model:activeKey="activeKey" animated type="card">
        <a-tab-pane key="1" tab="待办列表">
          <div class="section">
            <TodoList />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目进度">
          <div class="section">
            <GanttChart />
          </div>
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
.ant-tabs   {
  margin: 10px 20px;
}

.section {
  margin: 20px 0;
}

.section h2 {
  margin-bottom: 10px;
}

.section .content {
  background: #f0f2f5;
  padding: 20px;
  border-radius: 4px;
}
</style>