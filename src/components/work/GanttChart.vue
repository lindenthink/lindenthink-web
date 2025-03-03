<template>
  <div class="gantt-chart">
    <table>
      <thead>
        <tr>
          <th>任务</th>
          <th>开始日期</th>
          <th>结束日期</th>
          <th>进度</th>
          <th>处理人</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.name }}</td>
          <td>{{ task.startDate }}</td>
          <td>{{ task.endDate }}</td>
          <td>
            <div class="progress-bar">
              <div class="progress" :style="{ width: task.progress + '%' }"></div>
            </div>
          </td>
          <td>{{ task.assignee }}</td>
          <td>
            <button @click="editTask(task)">编辑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="editingTask" class="edit-form">
      <input v-model="editingTask.name" placeholder="任务名称" />
      <input type="date" v-model="editingTask.startDate" />
      <input type="date" v-model="editingTask.endDate" />
      <input type="number" v-model="editingTask.progress" placeholder="进度" />
      <input v-model="editingTask.assignee" placeholder="处理人" />
      <button @click="saveTask">保存</button>
      <button @click="cancelEdit">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([
  { id: 1, name: '需求分析', startDate: '2023-01-01', endDate: '2023-01-10', progress: 100, assignee: '张三' },
  { id: 2, name: '设计', startDate: '2023-01-11', endDate: '2023-01-20', progress: 80, assignee: '李四' },
  { id: 3, name: '开发', startDate: '2023-01-21', endDate: '2023-02-10', progress: 60, assignee: '王五' },
  { id: 4, name: '测试', startDate: '2023-02-11', endDate: '2023-02-20', progress: 40, assignee: '赵六' },
])

const editingTask = ref(null)

const editTask = (task) => {
  editingTask.value = { ...task }
}

const saveTask = () => {
  const index = tasks.value.findIndex(task => task.id === editingTask.value.id)
  if (index !== -1) {
    tasks.value[index] = { ...editingTask.value }
  }
  editingTask.value = null
}

const cancelEdit = () => {
  editingTask.value = null
}
</script>

<style scoped>
.gantt-chart table {
  width: 100%;
  border-collapse: collapse;
}

.gantt-chart th, .gantt-chart td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.gantt-chart th {
  background-color: #f0f2f5;
}

.progress-bar {
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  height: 20px;
}

.progress {
  background-color: #1890ff;
  height: 100%;
}

.edit-form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.edit-form input {
  margin-bottom: 10px;
  padding: 5px;
}

.edit-form button {
  margin-right: 10px;
}
</style>