<template>
  <a-row :gutter="24">
    <!-- 左侧列表区 -->
    <a-col :span="8">
      <a-card title="密码库">
        <div class="search-bar">
          <a-input-search v-model:value="searchKey" placeholder="搜索应用名称" @search="handleSearch" />
        </div>

        <a-list :data-source="filteredItems" :loading="loading" class="password-list">
          <template #renderItem="{ item }">
            <a-list-item :class="{ active: activeItem?.id === item.id }" @click="selectItem(item)">
              <a-list-item-meta :title="item.appName" :description="item.category" />
              <template #actions>
                <a-button type="link" @click="showEditModal(item)"><edit-outlined /></a-button>
                <a-button type="link" danger @click="deleteItem(item.id)"><delete-outlined /></a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>

    <!-- 右侧详情区 -->
    <a-col :span="16">
      <a-card :title="activeItem ? activeItem.appName : '选择条目'">
        <template #extra>
          <a-button type="primary" @click="showAddModal">
            <template #icon><plus-outlined /></template>
            新增条目
          </a-button>
        </template>

        <a-descriptions v-if="activeItem" bordered :column="1">
          <a-descriptions-item label="用户名">{{ activeItem.username }}</a-descriptions-item>
          <a-descriptions-item label="密码">
            <span class="password-field">{{ activeItem.password }}</span>
            <a-button type="link" @click="copyPassword(activeItem.password)">
              <copy-outlined />
            </a-button>
          </a-descriptions-item>
          <a-descriptions-item label="应用网址">
            <a :href="activeItem.url" target="_blank">{{ activeItem.url }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="备注">{{ activeItem.notes }}</a-descriptions-item>
        </a-descriptions>

        <div v-else class="empty-tip">请从左侧列表选择或新建条目</div>
      </a-card>
    </a-col>
  </a-row>

  <!-- 新增/编辑模态框 -->
  <a-modal
    v-model:visible="modalVisible"
    :title="isEditMode ? '编辑条目' : '新增条目'"
    @ok="submitForm"
    @cancel="resetForm"
  >
    <a-form :model="formState" layout="vertical">
      <a-form-item label="应用名称" required>
        <a-input v-model:value="formState.appName" />
      </a-form-item>
      <a-form-item label="用户名" required>
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="密码" required>
        <a-input-password v-model:value="formState.password" :visibility-toggle="false" />
      </a-form-item>
      <a-form-item label="应用网址">
        <a-input v-model:value="formState.url" addon-before="https://" />
      </a-form-item>
      <a-form-item label="分类">
        <a-select v-model:value="formState.category">
          <a-select-option value="社交">社交</a-select-option>
          <a-select-option value="金融">金融</a-select-option>
          <a-select-option value="工作">工作</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="formState.notes" :rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons-vue'
import CryptoJS from 'crypto-js'

// 加密配置
const ENCRYPT_KEY = import.meta.env.VITE_APP_SECRET || 'default-secret-key'

// 数据操作
const items = ref([])
const activeItem = ref(null)
const searchKey = ref('')
const loading = ref(false)
const modalVisible = ref(false)
const isEditMode = ref(false)

// 表单状态
const formState = reactive({
  id: null,
  appName: '',
  username: '',
  password: '',
  url: '',
  category: '社交',
  notes: '',
})

// 加密方法
const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPT_KEY).toString()
}

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPT_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 列表过滤
const filteredItems = computed(() => {
  return items.value.filter((item) => item.appName.toLowerCase().includes(searchKey.value.toLowerCase()))
})

// 操作逻辑
const selectItem = (item) => {
  activeItem.value = {
    ...item,
    password: decryptData(item.password),
  }
}

const showAddModal = () => {
  isEditMode.value = false
  modalVisible.value = true
}

const showEditModal = (item) => {
  Object.assign(formState, {
    ...item,
    password: decryptData(item.password),
  })
  isEditMode.value = true
  modalVisible.value = true
}

const submitForm = () => {
  const payload = {
    ...formState,
    password: encryptData(formState.password),
  }

  if (isEditMode.value) {
    const index = items.value.findIndex((i) => i.id === formState.id)
    items.value.splice(index, 1, payload)
  } else {
    items.value.push({ ...payload, id: Date.now() })
  }

  message.success('保存成功')
  resetForm()
}

const deleteItem = (id) => {
  items.value = items.value.filter((i) => i.id !== id)
  if (activeItem.value?.id === id) activeItem.value = null
  message.success('删除成功')
}

const resetForm = () => {
  formState.id = null
  formState.appName = ''
  formState.username = ''
  formState.password = ''
  formState.url = ''
  formState.category = '社交'
  formState.notes = ''
  modalVisible.value = false
}

const copyPassword = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => message.success('已复制密码'))
    .catch(() => message.error('复制失败'))
}

// 初始化示例数据
items.value = [
  {
    id: 1,
    appName: '示例应用',
    username: 'user@example.com',
    password: encryptData('P@ssw0rd!'),
    url: 'https://example.com',
    category: '社交',
    notes: '测试账号',
  },
]
</script>

<style scoped>
.password-list {
  margin-top: 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.active {
  background-color: #f0f5ff;
  border-right: 3px solid #1890ff;
}

.password-field {
  font-family: monospace;
  letter-spacing: 2px;
}

.empty-tip {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  padding: 24px 0;
}

.search-bar {
  margin-bottom: 16px;
}
</style>
