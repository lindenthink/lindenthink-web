<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <!-- 今日待办模块 -->
      <div class="section">
        <h2>今日待办</h2>
        <TodoList />
      </div>

      <!-- 项目进展模块 -->
      <div class="section">
        <h2>项目进展</h2>
        <GanttChart />
      </div>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import TodoList from '@/components/work/TodoList.vue'
import GanttChart from '@/components/work/GanttChart.vue'
</script>

<style scoped lang="less">
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