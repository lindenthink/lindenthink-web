<template>
  <!-- 筛选条件区域，仅登录用户可见 -->
  <div v-if="currentUser" class="filter-wrapper">
    <div class="filter-header" @click="toggleFilter">
      <span class="filter-title">筛选条件</span>
      <DownOutlined v-if="!isFilterExpanded" />
      <UpOutlined v-else />
    </div>
    <div v-if="isFilterExpanded" class="filter-container">
      <a-row :gutter="[16, 16]" justify="start" align="middle">
        <a-col><a-checkbox v-model:checked="filterOptions.onlyMine" @change="handleOnlyMineChange">我的</a-checkbox></a-col>
        <a-col><a-checkbox v-model:checked="filterOptions.myLike" @change="handleMyLikeChange">我喜欢的</a-checkbox></a-col>
        <template v-if="filterOptions.onlyMine">
          <a-col>
          <a-tree-select v-model:value="filterOptions.categoryId" :tree-data="categoryTree" placeholder="请选择分类"
            style="min-width: 120px" @change="handleFilterChange" allow-clear />
        </a-col>
        <a-col>
          <a-select v-model:value="filterOptions.seriesId" placeholder="请选择系列" style="width: 120px"
            @change="handleFilterChange" allow-clear>
            <a-select-option v-for="series in seriesList" :key="series.id" :value="series.id">{{ series.name
            }}</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-select v-model:value="filterOptions.state" placeholder="请选择状态" style="width: 120px"
            @change="handleFilterChange" allow-clear>
            <a-select-option value="INIT">未发布</a-select-option>
            <a-select-option value="APPROVED">已发布</a-select-option>
          </a-select>
        </a-col>
        </template>
      </a-row>
    </div>
  </div>

  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="articles" :loading="loading">
    <template #renderItem="{ item }">
      <a-list-item key="item.title" :class="{ 'article-item': true, 'hovered': currentHoverItem === item.id }"
        @mouseenter="handleMouseEnter(item.id)" @mouseleave="handleMouseLeave" @click="handleClick(item.id)">
        <a-list-item-meta>
          <template #description>
            <span><EditOutlined style="margin-right: 8px" />{{ item.author }}</span>
            <a-divider type="vertical"></a-divider>
            <span>
              <CalendarOutlined style="margin-right: 8px" />
              {{ dayjs(item.updated).format('YYYY-MM-DD') }}
            </span>
          </template>
          <template #title>
            <router-link :to="{ path: `/articles/${item.id}` }"> {{ item.title }} </router-link>
            <span v-if="currentUser && currentUser.id === item.userId" class="status-tag"
              :class="item.state === 'APPROVED' ? 'published' : 'unpublished'">
              {{ item.state === 'APPROVED' ? '已发布' : '未发布' }}
            </span>
            <span v-if="currentUser && currentUser.id === item.userId && currentHoverItem === item.id"
              class="action-buttons">
              <a-button type="link" size="small" @click.stop="handleEdit(item.id)">
                <EditOutlined />
              </a-button>
              <a-button type="link" size="small" @click.stop="handleDelete(item.id)" danger>
                <DeleteOutlined />
              </a-button>
            </span>
          </template>
          <template #avatar>  <UserCard :user-info="item"><a-avatar :src="item.avatar" /></UserCard></template>
        </a-list-item-meta>
        {{ item.outline }}
        <template #actions>
          <span>
            <EyeOutlined style="margin-right: 8px" />
            {{ item.visitCount }}
          </span>
          <span>
            <HeartOutlined style="margin-right: 8px" />
            {{ item.likeCount }}
          </span>
          <span>
            <MessageOutlined style="margin-right: 8px" />
            {{ item.commentCount }}
          </span>
        </template>
        <template #extra v-if="!isMobile && item.cover">
          <img width="400" alt="cover" :src="item.cover" />
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
import { EyeOutlined, HeartOutlined, MessageOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { ref, onBeforeMount } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { queryArticles, deleteArticle } from '@/services/articleService'
import { queryCategory, querySeries } from '@/services/materialService'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import UserCard from '@/components/UserCard.vue'


const isMobile = useMediaQuery('(max-width: 768px)')
const articles = ref([])
const loading = ref(false)
const currentHoverItem = ref(null)
const router = useRouter()
const userStore = useUserStore()
const currentUser = ref(null)

// 筛选选项
const filterOptions = ref({
  onlyMine: false,
  myLike: false,
  categoryId: null,
  seriesId: null,
  state: null
})

// 筛选区域展开状态
const isFilterExpanded = ref(false)

// 分类和系列列表
const categoryTree = ref([])
const seriesList = ref([])

const pagination = {
  onChange: async (page) => {
    handlePageChange(page)
  },
  pageSize: 5,
}

onBeforeMount(async () => {
  currentUser.value = userStore.userInfo
  if (currentUser.value) {
    await loadCategoriesAndSeries()
  }
  handlePageChange(1)
})

async function loadCategoriesAndSeries() {
  try {
    // 并行获取分类和系列数据
    const [categoryData, seriesData] = await Promise.all([
      queryCategory(),
      querySeries()
    ])

    categoryTree.value = categoryData || []
    seriesList.value = seriesData.map(item => ({
      id: item.id,
      name: item.content
    }))
  } catch (error) {
    console.error('加载分类和系列数据失败:', error)
    message.error('加载筛选数据失败')
  }
}

// 切换筛选区域展开/收起状态
function toggleFilter() {
  isFilterExpanded.value = !isFilterExpanded.value
}

function handlePageChange(page) {
  loading.value = true

  queryArticles({
    pagination: { ...pagination, page },
    data: {
      ...filterOptions.value,
      state: filterOptions.value.state === '' ? null : filterOptions.value.state
    }
  })
    .then((res) => {
      articles.value = res.data
      pagination.total = res.pagination.total
      pagination.current = page
    })
    .catch((e) => {
      console.error(e)
      message.error(e.message || '加载失败')
    })
    .finally(() => {
      loading.value = false
    })
}

function handleFilterChange() {
  // 重置到第一页
  handlePageChange(1)
}

function handleOnlyMineChange() {
  if (filterOptions.value.onlyMine) {
    filterOptions.value.myLike = false
  }
  handlePageChange(1)
}

function handleMyLikeChange() {
  if (filterOptions.value.myLike) {
    filterOptions.value.onlyMine = false
  }
  handlePageChange(1)
}

function handleMouseEnter(id) {
  currentHoverItem.value = id
}

function handleMouseLeave() {
  currentHoverItem.value = null
}

function handleEdit(id) {
  // 导航到编辑页面
  router.push({ path: `/articles/editor/${id}` })

}

function handleClick(id) {
  // 导航到详情页面
  router.push({ path: `/articles/${id}` })
}


async function handleDelete(id) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这篇文章吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteArticle(id)
        message.success('删除成功')
        // 重新加载文章列表
        handlePageChange(pagination.current || 1)
      } catch (e) {
        console.error(e)
        message.error(e.message || '删除失败')
      }
    }
  })
}
</script>

<style scoped lang="less">
:deep(.ant-list-pagination) {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 24px;
}

.filter-wrapper {
  border-bottom: 1px solid #e8e8e8;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-header:hover {
  background-color: #f5f5f5;
}

.filter-title {
  font-weight: 500;
}

.filter-container {
  padding: 10px;
  border-top: 1px solid #f0f0f0;
}

.article-item {
  position: relative;
  transition: all 0.3s;
}

.hovered {
  background-color: #f7f7f7;
}

.action-buttons {
  display: inline-flex;
  margin-left: 10vw;
}

.action-buttons .ant-btn {
  padding: 4px 15px;
}

.status-tag {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.published {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.unpublished {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
</style>
