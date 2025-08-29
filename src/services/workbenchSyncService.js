import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import useTodos from '@/composables/useTodos'
import { queryTodos, queryProjects, save } from '@/services/materialService'

// 工作台同步服务
class WorkbenchSyncService {
  constructor() {
    this.isSyncing = false
    this.syncListeners = new Set()
    this.syncQueue = Promise.resolve()
  }

  // 初始化同步服务
  init() {
    const userStore = useUserStore()
    // 用户登录时执行数据加载
    if (userStore.isLoggedIn) {
      this.loadDataOnLogin().catch(err => {
        console.error('初始数据加载失败:', err)
      })
    }
  }

  // 注册同步状态变化监听器
  onSyncStatusChange(callback) {
    this.syncListeners.add(callback)
    return () => {
      this.syncListeners.delete(callback)
    }
  }

  // 通知所有监听器同步状态变化
  notifySyncStatusChange(isSyncing, success = false) {
    this.syncListeners.forEach(callback => {
      try {
        callback(isSyncing, success)
      } catch (err) {
        console.error('同步状态通知失败:', err)
      }
    })
  }

  // 执行数据同步
  async syncData(type = null) {
    // 未登录直接不处理
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      return
    }
    // 创建一个新的Promise来包装同步逻辑
    // 这样即使同步失败，也不会影响syncQueue的状态
    const newSyncPromise = this.syncQueue.then(async () => {
      try {
        this.isSyncing = true
        this.notifySyncStatusChange(true)
        if (type === null || type === 'TODO') {
          console.log('开始同步数据')
          const todosData = this.loadTodosFromLocalStorage()
          if (todosData) {
            const res = await save({ 
              type: 'TODO',
              id: todosData.id,
              content: JSON.stringify(todosData)
            })
            if (!todosData.id) {
              localStorage.setItem('todos', JSON.stringify( { ...todosData, id: res.data }))
            }
          }
        }
        if (type === null || type === 'PROJECT') {
          const projectsData = this.loadProjectsFromLocalStorage()
          if (projectsData) {
            const res = await save({
              type: 'PROJECT',
              id: projectsData.id,
              content: JSON.stringify(projectsData)
            })
            if (!projectsData.id) {
              localStorage.setItem('projects', JSON.stringify({ ...projectsData, id: res.data }))
            }
          }
        }
        this.notifySyncStatusChange(false, true)
        console.log('数据同步成功')
      } catch (error) {
        console.error('数据同步失败:', error)
        this.notifySyncStatusChange(false, false)
        throw error
      } finally {
        this.isSyncing = false
      }
    })

    // 无论当前同步是成功还是失败，都确保syncQueue处于resolved状态
    // 这样下一次调用不会被上一次的失败所阻塞
    this.syncQueue = newSyncPromise.catch(() => {
      // 静默处理错误，只确保队列继续可用
      return Promise.resolve()
    })

    // 返回原始的同步Promise，让调用者能够处理成功或失败
    return newSyncPromise
  }

  loadTodosFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('todos')
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (e) {
      console.error('读取待办数据失败:', e)
    }
    return null
  }

  loadProjectsFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('projects')
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (e) {
      console.error('读取项目数据失败:', e)
    }
    return null
  }

  compareVersions(version1, version2) {
    if (!version1 && !version2) return false
    if (!version1) return false
    if (!version2) return true
    return version1 > version2
  }

  // 合并数据，判断是否需要进行同步：
  // 1. 如果本地没有数据但服务端有数据，需要更新本地数据
  // 2. 如果本地有数据但服务端没有数据，需要同步本地数据到服务端
  // 3. 如果本地和服务端都有数据，比较版本号确定是更新本地还是同步到服务端
  async mergeData(type, localData, serverRes) {
    let serverData
    if (serverRes?.length > 0) {
      const first = serverRes[0]
      serverData = JSON.parse(first.content)
      serverData.id = first.id
    }
    const localVersion = localData?.version || ''
    const serverVersion = serverData?.version || ''
    if (this.compareVersions(serverVersion, localVersion)) {
      // 服务端数据较新，需要更新本地数据
      const localKey = type === 'TODO' ? 'todos' : 'projects'
      localStorage.setItem(localKey, JSON.stringify(serverData))
      if (type === 'TODO') {
        // 触发待办数据更新
        const { loadTodoData } = useTodos()
        loadTodoData()
      } else if (type === 'PROJECT') {
        // 不同于待办，无需触发。因为待办是全局生效，在此之前就已经被加载。
      }
    } else if (this.compareVersions(localVersion, serverVersion)) {
      // 本地数据较新，需要同步到服务端
       await this.syncData(type)
    }
  }

  // 用户登录时的数据加载逻辑
  async loadDataOnLogin() {
    try {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        return
      }

      // 从localStorage加载数据
      const localTodos = this.loadTodosFromLocalStorage()
      const localProjects = this.loadProjectsFromLocalStorage()

      // 从服务端加载
      const serverTodoRes = await this.fetchTodosFromServer()
      const serverProjectRes = await this.fetchProjectsFromServer()

      await this.mergeData('TODO', localTodos, serverTodoRes)
      await this.mergeData('PROJECT', localProjects, serverProjectRes)
     
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('数据加载失败')
    }
  }

  async fetchTodosFromServer() {
    const data = await queryTodos()
    return data
  }

  async fetchProjectsFromServer() {
    const data = await queryProjects()
    return data
  }

  // 清理资源
  destroy() {
    this.syncListeners.clear()
  }
}

// 创建单例实例
export const workbenchSyncService = new WorkbenchSyncService()