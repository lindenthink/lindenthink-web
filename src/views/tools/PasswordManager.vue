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

  <a-modal v-model:visible="modalVisible" :title="isEditMode ? '编辑条目' : '新增条目'" @ok="submitForm" @cancel="resetForm">
    <a-form :model="formState" layout="horizontal" :rules="formRules" ref="formRef" :label-col="{ span: 4 }">
      <a-form-item label="应用名称" required name="appName">
        <a-input v-model:value="formState.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item label="用户名" required name="username">
        <a-input v-model:value="formState.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="密码" required name="password">
        <a-input-password v-model:value="formState.password" placeholder="请输入至少6位密码" :visibility-toggle="false" />
      </a-form-item>
      <a-form-item label="应用网址" name="url">
        <a-input v-model:value="formState.url" placeholder="请输入有效的URL" />
      </a-form-item>
      <a-form-item label="分类">
        <a-select v-model:value="formState.category">
          <a-select-option value="社交">社交</a-select-option>
          <a-select-option value="金融">金融</a-select-option>
          <a-select-option value="娱乐">娱乐</a-select-option>
          <a-select-option value="工具">工具</a-select-option>
          <a-select-option value="工作">工作</a-select-option>
          <a-select-option value="其他">其他</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="formState.notes" :rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons-vue'
import CryptoJS from 'crypto-js'
import { useUserStore } from '@/stores/user'
import { save, remove, queryPasswords } from '@/services/materialService.js'

// 加密配置
const ENCRYPT_KEY = import.meta.env.VITE_APP_SECRET || 'default-secret-key'

// 用户认证
const userStore = useUserStore()
const currentUser = ref(null)
const items = ref([])
const activeItem = ref(null)
const searchKey = ref('')
const loading = ref(false)
const modalVisible = ref(false)
const isEditMode = ref(false)


const queryAll = async () => {
  if (!currentUser.value) {
    message.error('需要先登录')

    return
  }
  loading.value = true
  try {
    const response = await queryPasswords()
    items.value = response.map((item) => {
      return {
        ...JSON.parse(item.content),
        id: item.id,
      }
    })
  } catch (error) {
    message.error('数据加载失败: ' + error.message)
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  currentUser.value = userStore.userInfo
  queryAll()
})
// 表单引用
const formRef = ref(null)

// 表单校验规则
const formRules = reactive({
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 1, max: 50, message: '应用名称长度在 1-50 个字符之间', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 50, message: '用户名长度在 1-50 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  url: [
    { type: 'url', message: '请输入有效的 URL', trigger: 'blur' }
  ]
})

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

const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPT_KEY).toString()
}

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPT_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

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
  if (!currentUser.value) {
    message.error('需要先登录')
    return
  }
  resetForm()
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

const submitForm = async () => {
  await formRef.value.validateFields()
  try {
    const payload = {
      ...formState,
      password: encryptData(formState.password),
    }
    const response = await save({
      id: formState.id,
      type: 'PASSWORD',
      content: JSON.stringify(payload),
    })
    if (isEditMode.value) {
      const index = items.value.findIndex((i) => i.id === formState.id)
      items.value.splice(index, 1, payload)
    } else {
      payload.id = response.data
      items.value.push(payload)
    }
    selectItem(payload)
    message.success('保存成功')
    resetForm()
  } catch (error) {
    message.error('保存失败: ' + (error.message || '未知错误'))
  }
}

const deleteItem = async (id) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个密码项吗？',
    onOk: async () => {
      try {
        await remove({
          type: 'PASSWORD',
          id: id
        })
        items.value = items.value.filter((i) => i.id !== id)
        activeItem.value = null
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败: ' + error.message)
      }
    }
  })
}

const resetForm = () => {
  // 重置表单状态
  formState.id = null
  formState.appName = ''
  formState.username = ''
  formState.password = ''
  formState.url = ''
  formState.category = '社交'
  formState.notes = ''

  // 重置表单校验
  if (formRef.value) {
    formRef.value.resetFields()
  }

  modalVisible.value = false
}

const copyPassword = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => message.success('已复制密码'))
    .catch(() => message.error('复制失败'))
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在computed属性filteredItems中实现
  // 这里可以添加额外的搜索处理逻辑
}

</script>

<style scoped>
.password-list {
  height: 30vh;
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
