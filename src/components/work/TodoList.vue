<template>
  <div class="todo-list">
    <ul>
      <li v-for="todo in todos" :key="todo.id" :class="{ overdue: isOverdue(todo) }">
        <input type="checkbox" v-model="todo.completed" />
        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
        <span class="due-date">{{ todo.dueDate }}</span>
        <button @click="editTodo(todo)">编辑</button>
      </li>
    </ul>
    <div v-if="editingTodo" class="edit-form">
      <input v-model="editingTodo.text" placeholder="编辑待办事项" />
      <input type="date" v-model="editingTodo.dueDate" />
      <button @click="saveTodo">保存</button>
      <button @click="cancelEdit">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todos = ref([
  { id: 1, text: '完成项目报告', completed: false, dueDate: '2023-03-05' },
  { id: 2, text: '参加团队会议', completed: false, dueDate: '2023-03-06' },
  { id: 3, text: '更新项目进度', completed: false, dueDate: '2023-03-07' },
])

const editingTodo = ref(null)

const isOverdue = (todo) => {
  const today = new Date().toISOString().split('T')[0]
  return !todo.completed && todo.dueDate < today
}

const editTodo = (todo) => {
  editingTodo.value = { ...todo }
}

const saveTodo = () => {
  const index = todos.value.findIndex(todo => todo.id === editingTodo.value.id)
  if (index !== -1) {
    todos.value[index] = { ...editingTodo.value }
  }
  editingTodo.value = null
}

const cancelEdit = () => {
  editingTodo.value = null
}
</script>

<style scoped>
.todo-list ul {
  list-style-type: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.todo-list input[type="checkbox"] {
  margin-right: 10px;
}

.todo-list .completed {
  text-decoration: line-through;
  color: grey;
}

.todo-list .due-date {
  margin-left: auto;
  margin-right: 10px;
  color: grey;
}

.todo-list .overdue .due-date {
  color: red;
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