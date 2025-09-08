<template>
  <a-popover
    placement="top"
    :trigger="['hover']"
    :title="null"
    @visibleChange="handleVisibleChange"
  >
    <template #content>
      <div class="user-card">
        <template v-if="loading">
          <!-- 骨架屏 -->
          <div class="user-card-skeleton">
            <div class="user-card-header">
              <div class="skeleton-avatar"></div>
              <div class="user-card-info">
                <div class="skeleton-line skeleton-name"></div>
                <div class="skeleton-line skeleton-email"></div>
              </div>
            </div>
            <div class="skeleton-line skeleton-brief"></div>
            <div class="skeleton-line skeleton-brief"></div>
          </div>
        </template>
        <template v-else>
          <div class="user-card-header">
            <a-avatar :size="48" :src="displayUserInfo.avatar" alt="用户头像">
              <template v-if="!displayUserInfo.avatar" #icon>
                {{ displayUserInfo.nickname?.[0].toUpperCase() || 'U' }}
              </template>
            </a-avatar>
            <div class="user-card-info">
              <h4 class="user-card-name">{{ displayUserInfo.nickname || displayUserInfo.author || displayUserInfo.username }}</h4>
              <p class="user-card-email" v-if="displayUserInfo.email">{{ displayUserInfo.email }}</p>
            </div>
          </div>
          <div class="user-card-brief" v-if="displayUserInfo.brief">
            {{ displayUserInfo.brief }}
          </div>
        </template>
      </div>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/services/userService'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const {isLoggedIn} = useUserStore()

const loading = ref(false)
  const serverUserInfo = ref({})
  const hasFetched = ref(false)

// 显示的用户信息，优先使用服务端数据，其次使用传入的数据
const displayUserInfo = computed(() => {
  return Object.keys(serverUserInfo.value).length > 0 ? serverUserInfo.value : props.userInfo
})

// 获取用户信息的函数
const fetchUserInfo = async () => {
  if (props.userInfo.userId && props.userInfo.userId > 0 && !hasFetched.value) {
    loading.value = true
    try {
      const res = await getUserInfo(props.userInfo.userId)
      if (res && res.data) {
        serverUserInfo.value = res.data
        hasFetched.value = true
      }
    } catch (error) {
      console.warn('获取用户信息失败:', error)
    } finally {
      loading.value = false
    }
  }
}

// 触发展示时调用接口
const handleVisibleChange = (visible) => {
  if (isLoggedIn && visible && !hasFetched.value) {
    fetchUserInfo()
  }
}

</script>

<style lang="less" scoped>
.user-card {
  padding: 12px;
  width: 300px;
  background: #fff;

  .user-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .user-card-info {
      margin-left: 12px;

      .user-card-name {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
      }

      .user-card-email {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .user-card-brief {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
  }

  // 骨架屏样式
  .user-card-skeleton {
    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #f0f0f0;
      animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-line {
      background: #f0f0f0;
      border-radius: 4px;
      animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-name {
      width: 120px;
      height: 20px;
      margin-bottom: 8px;
    }

    .skeleton-email {
      width: 180px;
      height: 16px;
    }

    .skeleton-brief {
      width: 100%;
      height: 16px;
      margin-bottom: 8px;
    }
  }

  @keyframes skeleton-loading {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
}

:deep(.ant-popover-inner) {
  background: #fff !important;
}

:deep(.ant-popover-inner-content) {
  padding: 0 !important;
}
</style>