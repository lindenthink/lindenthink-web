<template>
  <a-row :gutter="24">
    <a-col :span="24">
      <a-card title="待办列表">
        <template #extra>
          <a-space>
            <a-button-group>
              <a-button :type="selectedFilter === 'all' ? 'primary' : ''" @click="selectedFilter = 'all'"
                >全部</a-button
              >
              <a-button :type="selectedFilter === 'yesterday' ? 'primary' : ''" @click="selectedFilter = 'yesterday'"
                >昨日</a-button
              >
              <a-button :type="selectedFilter === 'today' ? 'primary' : ''" @click="selectedFilter = 'today'"
                >今日</a-button
              >
              <a-button :type="selectedFilter === 'tomorrow' ? 'primary' : ''" @click="selectedFilter = 'tomorrow'"
                >明日</a-button
              >
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
                  <a-tooltip v-if="item.reminded" title="已发送通知提醒" placement="right">
                    <a-tag color="green" style="margin-left: 8px;">
                      <bell-outlined />
                      已提醒
                    </a-tag>
                  </a-tooltip>
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

  <a-modal v-model:visible="showEdit" :title="isNew ? '新增待办' : '编辑待办'" @ok="saveTodo">
    <a-form ref="formRef" layout="vertical" :model="editingTodo">
      <a-form-item label="事项内容" name="text" :rules="[{ required: true, message: '请输入事项内容' }]">
        <a-textarea v-model:value="editingTodo.text" placeholder="输入待办事项内容" />
      </a-form-item>
      <a-form-item label="截止时间" name="dueDate" :rules="[{ required: true, message: '请选择截止时间' }]">
        <a-date-picker v-model:value="editingTodo.dueDate" show-time :format="datePattern" />
      </a-form-item>
      <a-form-item label="优先级">
        <a-select v-model:value="editingTodo.priority">
          <a-select-option v-for="(val, key) in labelMap" :key="key">{{ val }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-drawer title="回收站" :visible="showTrash" @close="showTrash = false">
    <a-list :data-source="todos.deleted">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.text" :description="formatDueDate(item.dueDate)" />
          <template #actions>
            <a-button style="margin-right: 8px" type="link" @click="restoreTodo(item)">恢复</a-button>
            <a-popconfirm title="确定永久删除该记录吗？" @confirm="deleteFromTrash(item.id)">
              <a-button danger type="text">删除</a-button>
            </a-popconfirm>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleFilled,
  WarningFilled,
  InfoCircleFilled,
  RestOutlined,
  BellOutlined,
} from '@ant-design/icons-vue'

// 导入待办管理服务
import useTodos from '@/composables/useTodos'

// 初始化待办管理服务
const {
  // 状态
  todos,
  selectedFilter,
  hasNotificationPermission,
  
  // 计算属性
  filteredTodos,
  
  // 配置
  colorMap,
  labelMap,
  datePattern,
  
  // 方法
  formatDueDate,
  getDueDateColor,
  getTodoItemClass,
  handleCheckChange,
  deleteFromTrash,
  deleteTodo,
  restoreTodo,
  requestNotificationPermission,
  persistData
} = useTodos()

// 表单相关
const editingTodo = ref(null)
const showEdit = ref(false)
const showTrash = ref(false)
const formRef = ref(null)
const isNew = ref(false)

// 创建新待办
const createNewTodo = () => {
  isNew.value = true
  editingTodo.value = {
    id: dayjs().unix(),
    text: '',
    dueDate: dayjs().add(1, 'hour').startOf('hour'),
    priority: 'medium',
    completed: false,
  }
  showEdit.value = true
}

// 保存待办
const saveTodo = async () => {
  await formRef.value.validate()
  editingTodo.value.reminded = false
  const index = todos.value.saved.findIndex((t) => t.id === editingTodo.value.id)
  if (index === -1) {
    todos.value.saved.push(editingTodo.value)
  } else {
    todos.value.saved.splice(index, 1, editingTodo.value)
  }
  persistData()
  showEdit.value = false
  
  // 请求通知权限
  if (!hasNotificationPermission.value) {
    const permission = await requestNotificationPermission()
    if (permission === 'granted') {
      console.log('用户已授予通知权限')
    } else if (permission === 'denied') {
      console.log('用户已拒绝通知权限')
    } else {
      console.log('用户尚未做出选择')
    }
  }
}

// 编辑待办
const editTodo = (item) => {
  isNew.value = false
  editingTodo.value = { ...item }
  editingTodo.value.dueDate = dayjs(editingTodo.value.dueDate)
  showEdit.value = true
}
</script>

<style scoped>
.todo-list {
  max-height: 54vh;
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
