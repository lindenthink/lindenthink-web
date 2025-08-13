<template>
  <div class="comment">
    <a-list
      class="comment-list"
      :header="`共 ${pagination.total || 0} 条评论`"

      item-layout="horizontal"
      :data-source="comments"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <CommentView :data="item" @reply-click="clickReply" @delete-click="handleDelete" :deletable="deletable || item.userId === currentUser?.id" />
        </a-list-item>
      </template>
    </a-list>

    <a-comment>
      <template #content>
        <a-form ref="formRef" :model="user" @finish="handleSubmit">
          <div class="user-info" v-if="!currentUser">
            <a-form-item name="nickname" :rules="[{ required: true, message: '昵称不能为空' }]">
              <a-input ref="usernameRef" v-model:value="user.nickname" placeholder="昵称" allow-clear>
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="url" :rules="[{ type: 'url', message: '链接格式不正确' }]" >
              <a-input v-model:value="user.url" placeholder="链接" allow-clear>
                <template #prefix>
                  <LinkOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="email" :rules="[{ type: 'email', message: '邮箱格式不正确' }]" >
              <a-input v-model:value="user.email" placeholder="邮箱" allow-clear>
                <template #prefix>
                  <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
          </div>
          <transition name="fade">
            <div v-if="isShowQuote === true" class="comment-quote">
              <a-comment :author="quoteItem.username" :avatar="quoteItem.avatar">
                <template #content> {{ quoteItem.content }} </template>
                <template #datetime>
                  <a-tooltip :title="quoteItem.created.format('YYYY-MM-DD HH:mm:ss')">
                    <span>{{ quoteItem.created.fromNow() }}</span>
                  </a-tooltip>
                </template>
                <template #actions>
                  <span @click="isShowQuote = false">取消回复</span>
                </template>
              </a-comment>
            </div>
          </transition>
          <a-form-item :rules="[{ required: true, message: '回复内容不能为空' }]">
            <a-textarea
              ref="textareaRef"
              v-model:value="commentContent"
              :rows="4"
              show-count
              :maxlength="200"
              allow-clear
              placeholder="请输入回复内容"
            />
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" :loading="submitting" type="primary"> 添加回复 </a-button>
          </a-form-item>
        </a-form>
      </template>
    </a-comment>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { UserOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { queryActions, saveAction, deleteAction } from '@/services/actionService'
import { useUserStore } from '@/stores/user'
import CommentView from '@/components/CommentView.vue'

const props = defineProps({
  owner: Number,
  deletable: Boolean,
})

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const comments = ref([])
const loading = ref(false)
const quoteItem = reactive({})
const textareaRef = ref()
const commentContent = ref('')
const submitting = ref(false)
const formRef = ref()
const isShowQuote = ref(false)
const userStore = useUserStore()
const currentUser = ref()
const pagination = {
  onChange: (page) => {
    handlePageChange(page)
  },
  pageSize: 5,
}

const handlePageChange = async (page) => {
  loading.value = true
  try {
    const res = await queryActions({
      pagination: { ...pagination, page },
      data : {
        type: 'COMMENT',
        targetId: props.owner,
      }
    })
    pagination.total = res.pagination.total
    pagination.current = page
    comments.value = res.data.map((item) => initItem(item))
  } catch (error) {
    console.error(error)
    message.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const user = reactive({
  nickname: '',
  url: '',
  email: '',
})

onMounted(async () => {
  currentUser.value = userStore.userInfo
  handlePageChange(1)
})

const initItem = (item) => {
  item.created = dayjs(item.created)
  item.actions = ['回复']
  if (item.children && item.children.length > 0) {
    item.children.forEach((child) => initItem(child))
  }
  return item
}

const handleSubmit = async () => {
  await formRef.value.validateFields()
  if (commentContent.value === '') {
    message.error('评论内容不能为空')
    return
  }
  const comment = {
    targetId: props.owner,
    nickname: user.nickname,
    url: user.url,
    email: user.email,
    content: commentContent.value,
    type: 'COMMENT',
    pid: isShowQuote.value ? quoteItem.id : null,
  }
  submitting.value = true
  try {
    await saveAction(comment)
    message.success('添加成功')
    commentContent.value = ''
    formRef.value.resetFields()
    handlePageChange(1)
    isShowQuote.value = false
  } catch (error) {
    console.error(error)
    message.error('添加失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

const clickReply = (item) => {
  quoteItem.id = item.id
  quoteItem.username = item.username
  quoteItem.avatar = item.avatar
  quoteItem.content = item.content
  quoteItem.created = item.created
  isShowQuote.value = true
  scrollToReply()
}

const handleDelete = async (item) => {
  try {
    await deleteAction('COMMENT', item.id)
    message.success('删除成功')
    handlePageChange(pagination.current || 1)
  } catch (error) {
    console.error(error)
    message.error('删除失败: ' + error.message)
  }
}

const scrollToReply = () => {
  window.scrollTo({ top: document.body.scrollHeight - 100, behavior: 'smooth' })
  setTimeout(() => textareaRef.value.focus(), 500)
}

defineExpose({ scrollToReply })
</script>

<style scoped lang="less">
.comment > .ant-comment {
  margin-top: 10px;
  padding-right: 10px;
  border: 1px dotted rgb(222, 222, 222);
}

.comment {
  border-top: 10px solid #f0f2f5;
  z-index: 9;
  padding: 2rem 2.5rem;
  margin-top: 10px;
  background-color: white;

  .comment-quote {
    display: flex;
    justify-content: space-between;
    padding: 0 1px 0 10px;
    border-left: 5px solid rgb(222, 222, 222);
    background-color: rgb(243, 242, 242);
    margin-bottom: 5px;
  }
}

.user-info {
  display: flex;
  justify-content: space-between;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
