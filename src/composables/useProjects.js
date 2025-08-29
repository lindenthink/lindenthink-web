import { ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { projectSyncService } from '@/services/materialService'

// 全局项目服务实例
let instance = null

// 创建项目服务
function createProjectsService() {
  // 项目数据
  const projects = ref({
    saved: [],
    deleted: []
  })

  // 日期模式
  const datePattern = 'YYYY-MM-DD'

  // 配置参数
  const CELL_WIDTH = 60
  const ROW_HEIGHT = 40

  // 从localStorage读取项目数据
  const loadProjectData = () => {
    try {
      const savedData = localStorage.getItem('projects')
      if (savedData) {
        projects.value = JSON.parse(savedData)
      }
    } catch (e) {
      console.error('读取项目数据失败:', e)
      projects.value = { saved: [], deleted: [] }
    }
  }

  const persistData = () => {
    try {
      localStorage.setItem('projects', JSON.stringify({
        ...projects.value,
        version: dayjs().format('YYYYMMDDHHmmssSSS')
      }))
      
      const savedSettings = localStorage.getItem('systemSettings')
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      if (settings.syncProjectsEnabled !== false) {
        projectSyncService.syncData('PROJECT').catch(err => {
          console.error('数据同步到服务端失败:', err)
        })
      }
    } catch (e) {
      console.error('保存项目数据失败:', e)
      message.error('数据保存失败')
    }
  }

  const initFormData = () => {
    return {
      id: '',
      title: '',
      startDate: null,
      endDate: null,
      assignees: [], // 数组存储
      progress: 0,
      progressColor: '#1890ff',
      children: [],
      level: 1, // 1-项目 2-子任务
    }
  }

  // 查找项目
  const findProject = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findProject(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 查找父节点ID
  const findParentId = (nodes, targetId, parentId = null) => {
    for (const node of nodes) {
      if (node.id === targetId) return parentId
      if (node.children) {
        const found = findParentId(node.children, targetId, node.id)
        if (found) return found
      }
    }
    return null
  }

  // 获取进度颜色
  const getProgressColor = (progress) => {
    if (progress < 30) return '#ff4d4f'
    if (progress < 70) return '#faad14'
    return '#52c41a'
  }

  // 验证表单
  const validateForm = (formData, dateRange, parentId) => {
    // 基础验证
    if (!formData.title?.trim()) {
      message.error('任务名称不能为空')
      return false
    }

    if (!dateRange[0] || !dateRange[1]) {
      message.error('请选择完整的时间范围')
      return false
    }

    // 时间顺序验证
    if (dateRange[0].isAfter(dateRange[1])) {
      message.error('开始时间不能晚于结束时间')
      return false
    }

    // 子任务时间范围验证
    if (parentId) {
      const parent = findProject(projects.value.saved, parentId)
      if (parent) {
        const parentStart = dayjs(parent.startDate)
        const parentEnd = dayjs(parent.endDate)

        if (dateRange[0].isBefore(parentStart) || dateRange[1].isAfter(parentEnd)) {
          message.error('子任务时间必须在父任务时间范围内')
          return false
        }
      }
    }

    return true
  }

  // 删除节点（递归）
  const deleteNode = (nodes, id) => {
    return nodes.filter((n) => {
      if (n.id === id) return false
      if (n.children) {
        n.children = deleteNode(n.children, id)
      }
      return true
    })
  }

  // 保存项目或任务
  const saveProject = async (formData, dateRange) => {
    if (!validateForm(formData, dateRange, formData.parentId)) return false

    const isEditMode = !!formData.id
    const newItem = {
      ...formData,
      id: formData.id || Date.now().toString(),
      startDate: dateRange[0].format(datePattern),
      endDate: dateRange[1].format(datePattern),
      progressColor: getProgressColor(formData.progress),
      assignees: formData.assignees.filter(Boolean),
    }

    if (newItem.parentId) {
      const parent = findProject(projects.value.saved, newItem.parentId)
      if (parent) {
        if (isEditMode) {
          const index = parent.children.findIndex((c) => c.id === newItem.id)
          if (index > -1) {
            parent.children.splice(index, 1, newItem)
          }
        } else {
          parent.children = parent.children ? [...parent.children, newItem] : [newItem]
        }
      }
    } else {
      if (isEditMode) {
        const index = projects.value.saved.findIndex((p) => p.id === newItem.id)
        if (index > -1) {
          projects.value.saved.splice(index, 1, newItem)
        }
      } else {
        projects.value.saved = [...projects.value.saved, newItem]
      }
    }

    persistData()
    message.success(isEditMode ? '更新成功' : '创建成功')
    return newItem
  }

  // 删除项目（移至回收站）
  const deleteProject = (node) => {
    const deletedItem = {
      ...node,
      deletedAt: dayjs().format(),
      parentId: findParentId(projects.value.saved, node.id),
    }

    // 使用新数组触发响应式更新
    projects.value.saved = deleteNode(projects.value.saved, node.id)

    // 添加到回收站
    projects.value.deleted = [...projects.value.deleted, deletedItem]

    persistData()
    message.success('删除成功')
  }

  // 从回收站恢复
  const restoreProject = (item) => {
    if (item.parentId) {
      const parent = findProject(projects.value.saved, item.parentId)
      if (parent) {
        parent.children = parent.children ? [...parent.children, item] : [item]
      } else {
        message.error('恢复失败，请先恢复父级项目')
        return false
      }
    } else {
      projects.value.saved = [...projects.value.saved, item]
    }
    // 从回收站移除
    projects.value.deleted = projects.value.deleted.filter((i) => i.id !== item.id)
    persistData()
    message.success('恢复成功')
    return true
  }

  // 彻底删除
  const deleteFromTrash = (item) => {
    if (item.parentId) {
      const parent = findProject(projects.value.deleted, item.parentId)
      if (parent && parent.children) {
        parent.children = parent.children.filter((c) => c.id !== item.id)
      }
    }
    projects.value.deleted = projects.value.deleted.filter((i) => i.id !== item.id)
    persistData()
    message.success('已永久删除')
  }

  // 获取行样式
  const getRowStyle = (item, index, baseDate) => {
    if (!item.startDate || !item.endDate || !baseDate) return { display: 'none' }

    const startDate = dayjs(item.startDate)
    const endDate = dayjs(item.endDate)

    // 计算相对于项目开始日期的偏移
    const startOffset = startDate.diff(baseDate, 'day') * CELL_WIDTH
    // 计算实际显示宽度
    const durationDays = endDate.diff(startDate, 'day') + 1

    return {
      height: ROW_HEIGHT + 'px',
      width: `${durationDays * CELL_WIDTH}px`,
      left: `${startOffset}px`,
      position: 'absolute',
      top: `${ROW_HEIGHT * index}px`,
      backgroundColor: item.level === 1 ? '#fafafa' : 'transparent',
    }
  }

  // 日期格式化
  const formatDate = (date) => dayjs(date).format('MM/DD')

  // 判断是否为今天
  const isToday = (dateStr) => {
    const date = dayjs(dateStr, 'MM/DD')
    return date.isSame(dayjs(), 'day')
  }

  // 计算时间线
  const generateTimeline = (startDate, endDate) => {
    if (!startDate || !endDate) return []

    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const days = end.diff(start, 'day') + 1

    return Array.from({ length: days }, (_, i) => start.add(i, 'day').format('MM/DD'))
  }

  // 计算当前日期在时间线中的索引
  const getTodayIndex = (timeline) => {
    return timeline.findIndex((d) => isToday(d))
  }

  // 计算所有参与人列表
  const getAllAssignees = () => {
    return projects.value.saved
      .flatMap((p) => p.assignees)
      .filter((v, i, a) => a.indexOf(v) === i)
  }

  return {
    // 状态
    projects,

    // 配置
    datePattern,
    CELL_WIDTH,
    ROW_HEIGHT,

    // 方法
    loadProjectData,
    persistData,
    initFormData,
    findProject,
    findParentId,
    getProgressColor,
    validateForm,
    saveProject,
    deleteProject,
    restoreProject,
    deleteFromTrash,
    getRowStyle,
    formatDate,
    isToday,
    generateTimeline,
    getTodayIndex,
    getAllAssignees
  }
}

// 初始化全局项目服务实例
function initializeProjectsService() {
  if (!instance) {
    instance = createProjectsService()

    // 在应用启动时初始化
    const init = async () => {
      try {
        console.log('开始初始化项目服务');
        instance.loadProjectData()
        console.log('项目服务初始化完成');
      } catch (error) {
        console.error('项目服务初始化失败:', error)
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
    }
  }

  return instance
}

// 导出全局项目服务
export default function useProjects() {
  // 确保实例已初始化
  return initializeProjectsService()
}