<template>
  <a-row :gutter="24">
    <!-- 左侧日历区 -->
    <a-col :span="14">
      <a-card title="日历视图">
        <a-calendar v-model:value="currentDate">
          <template #dateCellRender="{ current }">
            <div v-for="todo in getTodosByDate(current)" :key="todo.id" class="calendar-todo-marker"
              :class="{ overdue: isOverdue(todo) }">
              {{ todo.text }}
            </div>
          </template>
        </a-calendar>
      </a-card>
    </a-col>

    <!-- 右侧待办列表 -->
    <a-col :span="10">
      <a-card title="待办事项" :extra="`剩余待办：${pendingCount}`">
        <a-list :data-source="sortedTodos" class="todo-list">
          <template #renderItem="{ item }">
            <a-list-item :class="getTodoItemClass(item)">
              <template #actions>
                <a-tooltip title="编辑">
                  <a-button type="link" @click="editTodo(item)">
                    <edit-outlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip title="删除">
                  <a-button type="link" danger @click="deleteTodo(item.id)">
                    <delete-outlined />
                  </a-button>
                </a-tooltip>
              </template>
              <a-list-item-meta>
                <template #title>
                  <a-checkbox v-model:checked="item.completed">
                    <span :class="{ completed: item.completed }">{{ item.text }}</span>
                  </a-checkbox>
                </template>
                <template #description>
                  <div class="todo-meta">
                    <a-tag :color="getDueDateColor(item)">
                      <clock-circle-outlined />
                      {{ formatDueDate(item.dueDate) }}
                    </a-tag>
                    <a-tag :color="colorMap[item.priority]">
                      <template #icon>
                        <exclamation-circle-filled v-if="item.priority === 'high'" />
                        <warning-filled v-else-if="item.priority === 'medium'" />
                        <info-circle-filled v-else />
                      </template>
                      {{ labelMap[item.priority] }}
                    </a-tag>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>

        <!-- 新增/编辑表单 -->
        <a-drawer :title="editingTodo ? '编辑待办' : '新建待办'" :visible="showEdit" @close="showEdit = false" width="400">
          <a-form layout="vertical">
            <a-form-item label="事项内容" required>
              <a-textarea v-model:value="editingTodo.text" placeholder="输入待办事项内容" />
            </a-form-item>
            <a-form-item label="截止时间" required>
              <a-date-picker v-model:value="editingTodo.dueDate" show-time format="YYYY-MM-DD HH:mm" />
            </a-form-item>
            <a-form-item label="优先级">
              <a-select v-model:value="editingTodo.priority">
                <a-select-option v-for="(val, key) in labelMap" :key="key">{{ val }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="saveTodo">保存</a-button>
              <a-button style="margin-left: 8px" @click="showEdit = false">取消</a-button>
            </a-form-item>
          </a-form>
        </a-drawer>

        <!-- 新增按钮 -->
        <div class="add-button">
          <a-button type="primary" shape="circle" size="large" @click="createNewTodo">
            <template #icon><plus-outlined /></template>
          </a-button>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleFilled,
  WarningFilled,
  InfoCircleFilled
} from '@ant-design/icons-vue';


dayjs.locale('zh-cn') // 使用本地化语言

const colorMap = {
  high: 'red',
  medium: 'orange',
  low: 'blue'
};

const labelMap = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
};

// 待办数据
const todos = ref(JSON.parse(localStorage.getItem('todos')) || []);
const editingTodo = ref(null);
const currentDate = ref(dayjs());
const showEdit = ref(false);

// 计算属性
const pendingCount = computed(() => todos.value.filter(t => !t.completed).length);
const sortedTodos = computed(() => [...todos.value].sort((a, b) =>
  dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix()
));

// 提醒逻辑
let checkInterval;
onMounted(() => {
  checkInterval = setInterval(checkReminders, 60000); // 每分钟检查一次
});
onBeforeUnmount(() => clearInterval(checkInterval));

const checkReminders = () => {
  todos.value.forEach(todo => {
    if (!todo.completed && !todo.reminded) {
      const dueTime = dayjs(todo.dueDate).diff(dayjs(), 'minute');
      if (dueTime <= 30 && dueTime > 0) {
        showNotification(todo);
        todo.reminded = true;
      }
    }
  });
};

const showNotification = (todo) => {
  // if (Notification.permission === 'granted') {
  new Notification(`待办事项提醒: ${todo.text}`, {
    icon: `${location.href.replace('workbench', '')}/logo.jpg`,
    body: `将在30分钟内到期: ${formatDueDate(todo.dueDate)}`,
    onclick: () => {
      // 显示浏览器
      window.focus();
      this.close();
    }
  });
  // }
};

// 日期处理
const formatDueDate = (date) => dayjs(date).format('MM-DD HH:mm');
const getTodosByDate = (date) => todos.value.filter(todo =>
  dayjs(todo.dueDate).isSame(date, 'day')
);

// 样式处理
const getDueDateColor = (todo) => {
  if (todo.completed) return 'gray';
  const diff = dayjs(todo.dueDate).diff(dayjs(), 'hour');
  return diff < 1 ? 'red' : diff < 8 ? 'orange' : 'blue';
};

const getTodoItemClass = (todo) => ({
  'overdue-item': isOverdue(todo),
  'completed-item': todo.completed
});

// 核心功能
const isOverdue = (todo) => !todo.completed && dayjs(todo.dueDate).isBefore(dayjs());

const createNewTodo = () => {
  editingTodo.value = {
    id: dayjs().unix(),
    text: '',
    dueDate: dayjs(),
    priority: 'medium',
    completed: false
  };
  showEdit.value = true;
};

const saveTodo = () => {
  if (!editingTodo.value.text.trim()) {
    message.error('请输入事项内容');
    return;
  }

  const index = todos.value.findIndex(t => t.id === editingTodo.value.id);
  if (index === -1) {
    todos.value.push(editingTodo.value);
  } else {
    todos.value.splice(index, 1, editingTodo.value);
  }

  localStorage.setItem('todos', JSON.stringify(todos.value));
  showEdit.value = false;
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('用户已授予通知权限');
    } else if (permission === 'denied') {
      console.log('用户已拒绝通知权限');
    } else {
      console.log('用户尚未做出选择');
    }
  });
};


const editTodo = (item) => {
  editingTodo.value = { ...item };
  editingTodo.value.dueDate = dayjs(editingTodo.value.dueDate);
  showEdit.value = true;
};

const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id);
  localStorage.setItem('todos', JSON.stringify(todos.value));
};
</script>

<style scoped>
.todo-list {
  max-height: 70vh;
  overflow-y: auto;
}

.overdue-item {
  background-color: #fff1f0;
  border-left: 3px solid #ff4d4f;
}

.completed-item {
  opacity: 0.6;
}

.calendar-todo-marker {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 4px;
  margin: 2px;
  border-radius: 2px;
  background: #f0f0f0;
}

.add-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
}

.todo-meta {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>