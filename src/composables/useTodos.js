import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { projectSyncService } from '@/services/materialService'

// 全局待办服务实例
let instance = null

// 创建待办服务
function createTodosService() {
  // 待办数据
  const todos = ref({
    saved: [],
    deleted: []
  })

  // 通知相关
  let checkInterval = null
  const hasNotificationPermission = ref(false)

  // 过滤相关
  const selectedFilter = ref('today')

  // 日期模式
  const datePattern = 'YYYY-MM-DD HH:mm'

  // 优先级配置
  const colorMap = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  }

  const labelMap = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  }

  // 从localStorage读取待办数据
  const loadTodoData = () => {
    try {
      const savedData = localStorage.getItem('todos')
      if (savedData) {
        todos.value = JSON.parse(savedData)
      }
    } catch (e) {
      console.error('读取待办数据失败:', e)
      todos.value = { saved: [], deleted: [] }
    }
  }

  // 保存数据到localStorage
  const persistData = () => {
    try {
      localStorage.setItem('todos', JSON.stringify({
        ...todos.value,
        version: dayjs().format('YYYYMMDDHHmmssSSS') // 到毫秒级别
      }))
      
      // 数据变更时触发同步到服务端（仅同步待办数据）
      projectSyncService.syncData('TODO').catch(err => {
        console.error('数据同步到服务端失败:', err)
      })
    } catch (e) {
      console.error('保存待办数据失败:', e)
      message.error('数据保存失败')
    }
  }

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        hasNotificationPermission.value = permission === 'granted'
        return permission
      } catch (e) {
        console.error('请求通知权限失败:', e)
        return 'denied'
      }
    }
    return 'denied'
  }

  // 显示通知
  const showNotification = (todo) => {
    if ('Notification' in window && hasNotificationPermission.value) {
      try {
        const notification = new Notification(`待办事项提醒: ${todo.text}`, {
          icon: `${location.href.split('/').slice(0, 3).join('/')}/logo.jpg`,
          body: `将在30分钟内到期: ${dayjs(todo.dueDate).format('YYYY-MM-DD HH:mm')}`,
          requireInteraction: true, // 要求用户交互才会关闭通知
          tag: 'lindenthink-todo' // 添加标签以聚合相同类型的通知
        })

        // 点击通知事件处理
        notification.onclick = function (event) {
          // 阻止通知默认行为
          event.preventDefault();

          // 聚焦到浏览器窗口
          if (window && window.focus) {
            window.focus();
          }

          // 如果有需要，导航到待办页面
          if (window && window.location && !window.location.pathname.includes('workbench')) {
            window.location.href = '/workbench';
          }

          // 关闭通知
          notification.close();
        }

        // 添加错误处理
        notification.onerror = function (error) {
          console.error('通知错误:', error);
        }

        console.log('通知已显示:', todo.text);
        return true;
      } catch (e) {
        console.error('显示通知失败:', e);
        return false;
      }
    }
    console.log('不满足显示通知的条件: Notification API不可用或未获得权限');
    return false;
  }

  // 检查提醒
  const checkReminders = () => {
    try {
      let hasUpdated = false

      todos.value.saved.forEach((todo) => {
        if (!todo.completed && !todo.reminded) {
          const dueTime = dayjs(todo.dueDate).diff(dayjs(), 'minute')
          if (dueTime <= 30 && dueTime > 0) {
            const notificationShown = showNotification(todo)
            if (notificationShown) {
              todo.reminded = true
              hasUpdated = true
            }
          }
        }
      })

      // 如果有更新，保存数据
      if (hasUpdated) {
        persistData()
      }
    } catch (e) {
      console.error('检查待办提醒失败:', e)
    }
  }

  const startChecking = (interval = 60000) => {
    if (checkInterval) {
      clearInterval(checkInterval)
    }
    checkInterval = setInterval(checkReminders, interval)
  }

  const stopChecking = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  // 计算属性：排序后的待办事项
  const sortedTodos = computed(() =>
    [...instance.todos.value.saved].sort((a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix())
  )

  // 计算属性：过滤后的待办事项
  const filteredTodos = computed(() => {
    const now = dayjs()
    return sortedTodos.value.filter((todo) => {
      if (instance.selectedFilter.value === 'all') return true
      const dueDate = dayjs(todo.dueDate)
      switch (instance.selectedFilter.value) {
        case 'today':
          return dueDate.isSame(now, 'day')
        case 'yesterday':
          return dueDate.isSame(now.subtract(1, 'day'), 'day')
        case 'tomorrow':
          return dueDate.isSame(now.add(1, 'day'), 'day')
        default:
          return true
      }
    })
  })

  // 日期格式化
  const formatDueDate = (date) => dayjs(date).format(instance.datePattern)

  // 获取截止日期颜色
  const getDueDateColor = (todo) => {
    if (todo.completed) return 'gray'
    const diff = dayjs(todo.dueDate).diff(dayjs(), 'hour')
    return diff < 1 ? 'red' : diff < 8 ? 'orange' : 'blue'
  }

  // 获取待办项样式
  const getTodoItemClass = (todo) => ({
    'overdue-item': isOverdue(todo),
    'completed-item': todo.completed,
  })

  // 判断是否过期
  const isOverdue = (todo) => !todo.completed && dayjs(todo.dueDate).isBefore(dayjs())

  // 处理待办完成状态变更
  const handleCheckChange = (item) => {
    const index = instance.todos.value.saved.findIndex((t) => t.id === item.id)
    if (index > -1) {
      instance.todos.value.saved.splice(index, 1, item)
      instance.persistData()
    }
  }

  // 从回收站删除
  const deleteFromTrash = (id) => {
    instance.todos.value.deleted = instance.todos.value.deleted.filter((t) => t.id !== id)
    instance.persistData()
    message.success('已永久删除')
  }

  // 删除待办（移至回收站）
  const deleteTodo = (id) => {
    const todo = instance.todos.value.saved.find((t) => t.id === id)
    instance.todos.value.deleted.push({ ...todo, deletedAt: dayjs().format(instance.datePattern) })
    instance.todos.value.saved = instance.todos.value.saved.filter((t) => t.id !== id)
    instance.persistData()
  }

  // 从回收站恢复
  const restoreTodo = (item) => {
    instance.todos.value.saved.push(item)
    instance.todos.value.deleted = instance.todos.value.deleted.filter((t) => t.id !== item.id)
    instance.persistData()
  }

  return {
    // 状态
    todos,
    selectedFilter,
    hasNotificationPermission,

    // 计算属性
    sortedTodos,
    filteredTodos,

    // 配置
    colorMap,
    labelMap,
    datePattern,

    // 方法
    loadTodoData,
    persistData,
    requestNotificationPermission,
    checkReminders,
    startChecking,
    stopChecking,
    formatDueDate,
    getDueDateColor,
    getTodoItemClass,
    isOverdue,
    handleCheckChange,
    deleteFromTrash,
    deleteTodo,
    restoreTodo
  }
}

// 初始化全局待办服务实例
function initializeTodosService() {
  if (!instance) {
    instance = createTodosService()

    // 在应用启动时初始化
    const init = async () => {
      try {
        console.log('开始初始化待办服务');
        instance.loadTodoData()
        const permission = await instance.requestNotificationPermission()
        console.log('通知权限状态:', permission);
        if (permission === 'granted') {
          instance.checkReminders()
        }
        // 启动定时检查
        instance.startChecking()
        console.log('待办服务初始化完成');
      } catch (error) {
        console.error('待办服务初始化失败:', error)
      }
    }

    // 确保在浏览器环境中运行
    if (typeof window !== 'undefined') {
      // 在DOMContentLoaded事件后初始化，确保应用已经启动
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
      } else {
        // 如果DOM已经加载完成，直接初始化
        init()
      }

      // 在页面卸载时停止检查
      window.addEventListener('beforeunload', () => {
        if (instance) {
          instance.stopChecking()
        }
      })
    }
  }

  return instance
}

// 导出全局待办服务
export default function useTodos() {
  // 确保实例已初始化
  return initializeTodosService()
}