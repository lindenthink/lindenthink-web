<template>
  <a-row :gutter="24">
    <!-- 左侧项目树 -->
    <a-col :span="8">
      <a-card title="项目列表" class="project-list">
        <template #extra>
          <a-button type="primary" size="small" style="margin-right: 5px" @click="handleAddRoot">
            <template #icon><plus-outlined /></template>
            新增
          </a-button>
          <a-button size="small" @click="showTrash = true">
            <template #icon><rest-outlined /></template>
            回收站
          </a-button>
        </template>

        <a-tree
          :tree-data="projects.saved"
          :field-names="{ children: 'children', title: 'title', key: 'id' }"
          show-line
          block-node
          @select="handleSelectProject"
        >
          <template #title="{ dataRef }">
            <div class="project-node">
              <span>{{ dataRef.title }}</span>
              <a-space>
                <a-tooltip v-if="dataRef.level === 1" title="添加子任务">
                  <a-button size="small" type="link" @click.stop="handleAddChild(dataRef)">
                    <template #icon><plus-outlined :style="{ color: '#52c41a' }" /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="编辑">
                  <a-button size="small" type="link" @click.stop="handleEdit(dataRef)">
                    <template #icon><edit-outlined /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="删除">
                  <a-button danger size="small" type="link" @click.stop="handleDelete(dataRef)">
                    <template #icon><delete-outlined /></template>
                  </a-button>
                </a-tooltip>
              </a-space>
            </div>
          </template>
        </a-tree>
      </a-card>
    </a-col>

    <!-- 右侧甘特图 -->
    <a-col :span="16">
      <a-card :title="`排期进度 - ${selectedProject?.title || '未选择项目'}`">
        <template #extra>
          <a-select
            v-model:value="selectedAssignees"
            mode="multiple"
            placeholder="选择参与人过滤"
            style="width: 300px"
            :options="assigneeOptions"
          />
        </template>
        <div class="gantt-container">
          <div class="gantt-header">
            <div class="info-columns">
              <div class="info-cell task-info task-title">任务详情</div>
            </div>
            <div class="time-scale" :style="{ width: timelineWidth + 'px' }">
              <div
                v-for="(date, index) in timeline"
                :key="index"
                class="time-cell"
                :class="{ 'today-cell': projectService.isToday(date) }"
              >
                {{ date }}
              </div>
            </div>
          </div>

          <div class="gantt-body" @scroll="syncScroll">
            <template v-if="selectedProject">
              <div
                v-for="(item, index) in visibleTasks"
                :key="item.id"
                class="gantt-row"
                :style="getRowStyle(item, index)"
              >
                <div class="info-columns">
                  <div class="info-cell task-info">
                    {{ item.level === 1 ? '' : item.assignees.join(', ') + '：' }}{{ item.title }}({{ item.progress }}%)
                  </div>
                </div>
                <div class="task-bar">
                  <div
                    class="progress"
                    :style="{
                      width: item.progress + '%',
                      backgroundColor: item.progressColor,
                    }"
                  />
                  <div class="date-range">
                    {{ formatDate(item.startDate) }}
                    {{
                      item.startDate === item.endDate
                        ? ''
                        : ` -
                    ${formatDate(item.endDate)}`
                    }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </a-card>
    </a-col>

    <!-- 项目编辑弹窗 -->
    <a-modal
      v-model:visible="showModal"
      :title="`${formData.id ? '编辑' : '新建'}${formData.level === 1 ? '项目' : '任务'}`"
      @ok="handleSave"
    >
      <a-form layout="vertical">
        <a-form-item label="任务名称" required>
          <a-input v-model:value="formData.title" />
        </a-form-item>
        <a-form-item label="日期范围" required>
          <a-range-picker v-model:value="dateRange" :disabled-date="disabledDate" />
        </a-form-item>
        <a-form-item label="参与人">
          <a-select
            v-model:value="formData.assignees"
            mode="tags"
            placeholder="输入或选择参与人"
            :options="existingAssignees"
          />
        </a-form-item>
        <a-form-item label="进度">
          <a-slider
            v-model:value="formData.progress"
            :marks="{ 0: '0%', 20: '20%', 50: '50%', 80: '80%', 100: '100%' }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-row>

  <a-drawer title="回收站" :visible="showTrash" width="500" @close="showTrash = false">
    <a-table :data-source="projects.deleted" row-key="id" :pagination="false">
      <a-table-column title="任务名称" data-index="title" />
      <a-table-column title="删除时间" data-index="deletedAt">
        <template #default="{ text }">
          {{ dayjs(text).format('YYYY-MM-DD HH:mm') }}
        </template>
      </a-table-column>
      <a-table-column title="操作">
        <template #default="{ record }">
          <a-button style="margin-right: 8px" type="link" @click="handleRestore(record)">恢复</a-button>
          <a-popconfirm title="确定永久删除该记录吗？" @confirm="deleteFromTrash(record)">
            <a-button danger type="text">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
  </a-drawer>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { DeleteOutlined, PlusOutlined, EditOutlined, RestOutlined } from '@ant-design/icons-vue'
import useProjects from '@/composables/useProjects'

dayjs.extend(minMax)

const selectedProject = ref(null)
const showModal = ref(false)
const formData = ref({})
const dateRange = ref([])
const selectedAssignees = ref([])
const showTrash = ref(false)

// 使用项目服务
const projectService = useProjects()
const projects = computed(() => projectService.projects.value)
const { CELL_WIDTH, ROW_HEIGHT } = projectService

// 计算属性
const timeline = computed(() => {
  if (!selectedProject.value?.startDate) return []
  return projectService.generateTimeline(selectedProject.value.startDate, selectedProject.value.endDate)
})

const todayIndex = computed(() => {
  return projectService.getTodayIndex(timeline.value)
})

// 添加滚动方法
const scrollToToday = () => {
  if (todayIndex.value === -1) return

  nextTick(() => {
    const container = document.querySelector('.gantt-body')
    if (!container) return

    const scrollLeft = todayIndex.value * CELL_WIDTH - container.clientWidth / 2 + 180
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth',
    })
  })
}

// 在项目选择变化时触发
watch(selectedProject, () => {
  if (selectedProject.value) {
    scrollToToday()
  }
})

// 添加现有参与人选项
const existingAssignees = computed(() =>
  projectService.getAllAssignees()
    .map((a) => ({ value: a })),
)

const timelineWidth = computed(() => timeline.value.length * CELL_WIDTH)

const visibleTasks = computed(() => {
  if (!selectedProject.value) return []

  // 获取二级结构数据
  const tasks = [
    selectedProject.value,
    ...(selectedProject.value.children || []).map((child) => ({
      ...child,
      level: 2,
    })),
  ]

  // 参与人过滤
  return tasks.filter((task) => {
    const hasAssignee =
      selectedAssignees.value.length === 0 || task.assignees.some((a) => selectedAssignees.value.includes(a))
    return task.startDate && task.endDate && hasAssignee
  })
})

// 参与人选项计算
const assigneeOptions = computed(() => {
  const allAssignees = visibleTasks.value.flatMap((t) => t.assignees)
  return [...new Set(allAssignees)].map((a) => ({ label: a, value: a }))
})

// 初始化表单数据
function initFormData() {
  return projectService.initFormData()
}

function handleSelectProject(keys, { node }) {
  const task = node.dataRef
  selectedProject.value = task

  // 初始化编辑表单
  if (task.id) {
    formData.value = {
      ...task,
      assignees: [...task.assignees],
    }
    dateRange.value = [dayjs(task.startDate), dayjs(task.endDate)]
  }
}

function handleAddRoot() {
  formData.value = initFormData() // 重置表单数据
  formData.value.assignees = ['全员']
  dateRange.value = [dayjs(), dayjs().add(1, 'day')]
  showModal.value = true
}

function handleAddChild(parent) {
  formData.value = {
    ...initFormData(),
    parentId: parent.id,
    level: 2,
  }
  dateRange.value = [dayjs(parent.startDate), dayjs(parent.endDate)]
  showModal.value = true
}

async function handleSave() {
  const newItem = await projectService.saveProject(formData.value, dateRange.value)
  if (newItem) {
    selectedProject.value = newItem
    resetForm()
  }
}

function handleDelete(node) {
  projectService.deleteProject(node)

  // 强制刷新选中项目
  if (selectedProject.value?.id === node.id) {
    selectedProject.value = projects.value.saved[0] || null
  }
}



function resetForm() {
  showModal.value = false
  formData.value = initFormData()
  dateRange.value = []
}



function getRowStyle(item, index) {
  if (!selectedProject.value?.startDate) return { display: 'none' }
  return projectService.getRowStyle(item, index, dayjs(selectedProject.value.startDate))
}

function syncScroll(e) {
  const header = document.querySelector('.gantt-header')
  if (header) {
    header.scrollLeft = e.target.scrollLeft
  }
}

function formatDate(date) {
  return projectService.formatDate(date)
}

function disabledDate(current) {
  return current && current < dayjs(selectedProject.value?.startDate).startOf('day')
}

function handleEdit(task) {
  formData.value = {
    ...task,
    assignees: [...task.assignees],
  }
  dateRange.value = [dayjs(task.startDate), dayjs(task.endDate)]
  showModal.value = true
}

function handleRestore(item) {
  projectService.restoreProject(item)
}

// 彻底删除
function deleteFromTrash(item) {
  projectService.deleteFromTrash(item)
}
</script>

<style scoped>
.project-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 11px;
}

.project-list {
  max-height: 65vh;
  overflow: auto;
}

.progress {
  min-width: 5px;
  /* 保证进度条可见 */
}

.gantt-container {
  height: 54vh;
  overflow: hidden;
  position: relative;
}

.gantt-header {
  color: rgb(95, 94, 94);
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
  overflow: hidden;
  border-bottom: 2px solid #f0f0f0;
}

.time-scale {
  display: flex;
  height: 40px;
  background: #fafafa;
  margin-left: 180px;
}

.time-cell {
  flex: 0 0 v-bind(CELL_WIDTH + 'px');
  line-height: 40px;
  text-align: center;
  border-right: 1px solid #e8e8e8;
  font-size: 12px;
}

.today-cell {
  background-color: #fffb8f !important;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #ff4d4f;
  }
}

.gantt-body {
  height: calc(100% - 40px);
  overflow: auto;
  position: relative;
}

.gantt-row {
  transition: opacity 0.3s ease;
  position: absolute;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  padding: 4px 0;
}

.task-bar {
  min-width: 100%;
  position: relative;
  z-index: 1;
  margin-left: 180px;
  height: 24px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  transition: width 0.3s;
}

.date-range {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.info-columns {
  position: absolute;
  left: 0;
  width: 180px;
  display: flex;
  z-index: 3;
  background: white;
  border-right: 1px solid #f0f0f0;
  font-size: 12px;
}

.info-cell {
  display: flex;
  padding: 0 5px;
  line-height: 40px;
  align-items: center;
  justify-content: right;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.task-info {
    width: 180px;
    font-weight: 500;
  }

  &.task-title {
    justify-content: center;
    background: #fafafa;
  }
}
</style>
