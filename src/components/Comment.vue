<template>
  <div class="comment">
    <a-list
      class="comment-list"
      :header="`共 ${comments.length} 条回复`"
      item-layout="horizontal"
      :data-source="comments"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <CommentView :data="item" @reply-click="clickReply" />
        </a-list-item>
      </template>
    </a-list>

    <a-comment>
      <template #content>
        <a-form ref="formRef" :model="user" @finish="handleSubmit">
          <div class="user-info">
            <a-form-item :name="'name'" :rules="[{ required: true, message: '昵称不能为空' }]">
              <a-input ref="usernameRef" v-model:value="user.name" placeholder="昵称">
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item :name="'link'" :rules="[{ type: 'url', message: '链接格式不正确' }]">
              <a-input v-model:value="user.link" placeholder="链接">
                <template #prefix>
                  <LinkOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item :name="'email'" :rules="[{ type: 'email', message: '邮箱格式不正确' }]">
              <a-input v-model:value="user.email" placeholder="邮箱">
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
import { getComments, addComment } from '@/services/commentService'
import CommentView from '@/components/CommentView.vue'

const props = defineProps({
  owner: String,
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
const pagination = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange: (page) => {
    // do nothing
  },
  showQuickJumper: true,
  pageSize: 5,
}

const user = reactive({
  id: '',
  type: 'ANON', // REG 注册和匿名
  name: '',
  email: '',
  link: '',
  avatar: '',
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getComments(props.owner)
    comments.value = res.data.map((item) => initItem(item))
  } catch (error) {
    console.error(error)
    message.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
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
    owner: props.owner,
    userId: user.id,
    username: user.name,
    email: user.email,
    avatar: user.avatar,
    content: commentContent.value,
    parentId: isShowQuote.value ? quoteItem.id : null,
  }
  submitting.value = true
  try {
    await addComment(comment)
    message.success('添加成功')
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
