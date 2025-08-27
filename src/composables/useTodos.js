import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

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
      localStorage.setItem('todos', JSON.stringify(todos.value))
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
        new Notification(`待办事项提醒: ${todo.text}`, {
          icon: `${location.href.split('/').slice(0, 3).join('/')}/logo.jpg`,
          body: `将在30分钟内到期: ${dayjs(todo.dueDate).format('YYYY-MM-DD HH:mm')}`,
          onclick: () => {
            // 点击通知后聚焦到浏览器窗口
            window.focus()
            // 如果有需要，导航到待办页面
            if (!window.location.pathname.includes('workbench')) {
              window.location.href = '/workbench'
            }
          },
        })
        return true; // 通知成功显示
      } catch (e) {
        console.error('显示通知失败:', e)
        return false; // 通知显示失败
      }
    }
    return false; // 不满足显示通知的条件
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
            // 只有在通知成功显示的情况下才标记为已提醒
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
  
  const startChecking = (interval = 120000) => { // 2分钟检查一次
    if (checkInterval) {
      clearInterval(checkInterval)
    }
    checkInterval = setInterval(checkReminders, interval)
  }
  
  // 停止检查
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
        // 加载数据
        instance.loadTodoData()
        // 立即检查一次
        instance.checkReminders()
        // 请求权限
        await instance.requestNotificationPermission()
        // 启动定时检查
        instance.startChecking()
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