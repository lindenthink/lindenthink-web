<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <div style="position: absolute; top: 16px; right: 16px; z-index: 100;">
        <a-tooltip v-if="userStore.isLoggedIn" title="同步数据">
          <a-button type="text" @click="handleManualSync">
            <span :class="['sync-icon', { spinning: isSyncing, success: !isSyncing && syncSuccess }]">
              <component :is="isSyncing || !syncSuccess ? ReloadOutlined : CheckOutlined" />
            </span>
          </a-button>
        </a-tooltip>
      </div>
      <a-tabs v-model:active-key="activeKey" animated>
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
import { ref, onMounted, onUnmounted, h } from 'vue'
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

import TodoList from '@/views/work/TodoList.vue'
import GanttChart from '@/views/work/GanttChart.vue'
import { workbenchSyncService } from '@/services/workbenchSyncService'
import { message } from 'ant-design-vue'

const activeKey = ref('1')
const isSyncing = ref(false)
const syncSuccess = ref(false)
const syncSuccessTimer = ref(null)
const userStore = useUserStore()



// 监听同步状态变化
const handleSyncStatusChange = (syncing, success) => {
  isSyncing.value = syncing
  
  if (!syncing && success) {
    syncSuccess.value = true
    
    // 3秒后隐藏成功图标
    if (syncSuccessTimer.value) {
      clearTimeout(syncSuccessTimer.value)
    }
    syncSuccessTimer.value = setTimeout(() => {
      syncSuccess.value = false
    }, 3000)
  } else if (!syncing) {
    syncSuccess.value = false
  }
}

// 手动触发同步
const handleManualSync = () => {
  if (!isSyncing.value && userStore.isLoggedIn) {
    workbenchSyncService.loadDataOnLogin().catch(err => {
      // console.error('手动同步失败:', err)
      message.error('手动同步失败:' + err.message)
    })
  }
}

onMounted(() => {
  // 初始化同步服务
  workbenchSyncService.init()
  
  // 注册同步状态监听器
  const unsubscribe = workbenchSyncService.onSyncStatusChange(handleSyncStatusChange)
  
  // 组件卸载时清理监听器
  onUnmounted(() => {
    unsubscribe()
    if (syncSuccessTimer.value) {
      clearTimeout(syncSuccessTimer.value)
    }
  })
})
</script>

<style scoped lang="less">
.ant-tabs {
  margin: 10px 20px;
}

.sync-icon {
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #999;
  
  &:hover {
    color: #1890ff;
  }
  
  &.spinning {
    animation: spin 1s linear infinite;
    color: #1890ff;
  }
  
  &.success {
    color: #52c41a;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
