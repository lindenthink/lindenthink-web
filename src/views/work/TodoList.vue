<template>
  <a-row :gutter="24">
    <a-col :span="24">
      <a-card title="待办列表">
        <template #extra>
          <a-space>
            <a-button-group>
              <a-button :type="selectedFilter === 'all' ? 'primary' : ''" @click="selectedFilter = 'all'">全部</a-button>
              <a-button :type="selectedFilter === 'yesterday' ? 'primary' : ''"
                @click="selectedFilter = 'yesterday'">昨日</a-button>
              <a-button :type="selectedFilter === 'today' ? 'primary' : ''"
                @click="selectedFilter = 'today'">今日</a-button>
              <a-button :type="selectedFilter === 'tomorrow' ? 'primary' : ''"
                @click="selectedFilter = 'tomorrow'">明日</a-button>
            </a-button-group>
            <a-button type="primary" @click="createNewTodo">
              <template #icon><plus-outlined /></template>
              新增
            </a-button>
            <a-button @click="showTrash = true">
              <template #icon><rest-outlined /></template>
              回收站
            </a-button>

          </a-space>
        </template>

        <a-list :data-source="filteredTodos" class="todo-list">
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
                  <a-checkbox v-model:checked="item.completed" @change="() => handleCheckChange(item)">
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
                      <exclamation-circle-filled v-if="item.priority === 'high'" />
                      <warning-filled v-else-if="item.priority === 'medium'" />
                      <info-circle-filled v-else />
                      {{ labelMap[item.priority] }}
                    </a-tag>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>
  </a-row>

  <a-modal :title="isNew ? '新增待办' : '编辑待办'" v-model:visible="showEdit" @ok="saveTodo">
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
    </a-form>
  </a-modal>

  <a-drawer title="回收站" :visible="showTrash" @close="showTrash = false">
    <a-list :data-source="deletedTodos">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.text" :description="formatDueDate(item.dueDate)" />
          <template #actions>
            <a-button @click="restoreTodo(item)" style="margin-right: 8px">恢复</a-button>
            <a-popconfirm title="确定永久删除该待办吗？" @confirm="deleteFromTrash(item.id)">
              <a-button danger type="link">
                <delete-outlined />
              </a-button>
            </a-popconfirm>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleFilled,
  WarningFilled,
  InfoCircleFilled,
  RestOutlined
} from '@ant-design/icons-vue';


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
const showEdit = ref(false);
const selectedFilter = ref('all');
const showTrash = ref(false);

const handleCheckChange = (item) => {
  const index = todos.value.findIndex(t => t.id === item.id);
  if (index > -1) {
    todos.value.splice(index, 1, item);
    persistData();
  }
};

const deleteFromTrash = (id) => {
  deletedTodos.value = deletedTodos.value.filter(t => t.id !== id);
  persistData();
  message.success('已永久删除');
};

const deletedTodos = ref(JSON.parse(localStorage.getItem('deletedTodos')) || []);

const sortedTodos = computed(() => [...todos.value].sort((a, b) =>
  dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix()
));

const filteredTodos = computed(() => {
  const now = dayjs();
  return sortedTodos.value.filter(todo => {
    if (selectedFilter.value === 'all') return true;
    const dueDate = dayjs(todo.dueDate);
    switch (selectedFilter.value) {
      case 'today': return dueDate.isSame(now, 'day');
      case 'yesterday': return dueDate.isSame(now.subtract(1, 'day'), 'day');
      case 'tomorrow': return dueDate.isSame(now.add(1, 'day'), 'day');
      default: return true;
    }
  });
});
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
        persistData();
      }
    }
  });
};

const showNotification = (todo) => {
  if (Notification.permission === 'granted') {
    new Notification(`待办事项提醒: ${todo.text}`, {
      icon: `${location.href.replace('workbench', '')}/logo.jpg`,
      body: `将在30分钟内到期: ${formatDueDate(todo.dueDate)}`,
      onclick: () => {
        // 显示浏览器
        window.focus();
        this.close();
      },
    });
  }
};

// 日期处理
const formatDueDate = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');

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

const isNew = ref(false)
const createNewTodo = () => {
  isNew.value = true
  editingTodo.value = {
    id: dayjs().unix(),
    text: '',
    dueDate: dayjs().add(1, 'day'),
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
  editingTodo.value.reminded = false;
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
  isNew.value = false
  editingTodo.value = { ...item };
  editingTodo.value.dueDate = dayjs(editingTodo.value.dueDate);
  showEdit.value = true;
};

const deleteTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  deletedTodos.value.push({ ...todo, deletedAt: dayjs().format() });
  todos.value = todos.value.filter(t => t.id !== id);
  persistData();
};

const restoreTodo = (item) => {
  todos.value.push(item);
  deletedTodos.value = deletedTodos.value.filter(t => t.id !== item.id);
  persistData();
};

const persistData = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value));
  localStorage.setItem('deletedTodos', JSON.stringify(deletedTodos.value));
};
</script>

<style scoped>
.todo-list {
  max-height: 70vh;
  overflow-y: auto;
}

.overdue-item {
  background-color: #fff1f0;
  padding-left: 3px;
  border-left: 3px solid #ff4d4f;
}

.completed-item {
  opacity: 0.6;
}

.todo-meta {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.ant-btn-group {
  margin-right: 16px;
}

.trash-button {
  margin-left: auto;
  padding-right: 24px;
}
</style>