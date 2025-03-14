<template>
  <div class="comment">
    <a-list
      class="comment-list"
      :header="`共 ${data.length} 条回复`"
      item-layout="horizontal"
      :data-source="data"
      :pagination="pagination"
    >
      <template #renderItem="{ item }" class="comment">
        <a-list-item>
          <a-comment :author="item.author" :avatar="item.avatar">
            <template #actions>
              <span v-for="(action, index) in item.actions" :key="index" @click="clickReply(item)">{{ action }}</span>
            </template>
            <template #content>
              {{ item.content }}
            </template>
            <template #datetime>
              <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ item.datetime.fromNow() }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>

    <a-comment>
      <template #content>
        <a-form ref="formRef" :model="user" @finish="handleSubmit">
          <div class="user-info">
            <a-form-item :name="'name'" :rules="[{ required: true, message: '昵称不能为空' }]">
              <a-input v-model:value="user.name" placeholder="昵称" ref="usernameRef">
                <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item :name="'link'" :rules="[{ type: 'url', message: '链接格式不正确' }]">
              <a-input v-model:value="user.link" placeholder="链接">
                <template #prefix><LinkOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item :name="'email'" :rules="[{ type: 'email', message: '邮箱格式不正确' }]">
              <a-input v-model:value="user.email" placeholder="邮箱">
                <template #prefix><MailOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>
          </div>
          <transition name="fade">
          <div class="comment-quote" v-if="isShowQuote === true">
            <a-comment :author="quoteItem.author" :avatar="quoteItem.avatar">
              <template #content> {{ quoteItem.content }} </template>
              <template #datetime>
                <a-tooltip :title="date2.format('YYYY-MM-DD HH:mm:ss')">
                  <span>{{ quoteItem.datetime.fromNow() }}</span>
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
              v-model:value="commentContent"
              :rows="4"
              show-count
              :maxlength="200"
              allow-clear
              ref="textareaRef"
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

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type { FormInstance } from 'ant-design-vue'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  UserOutlined,
  LinkOutlined,
  MailOutlined,
} from '@ant-design/icons-vue'

const props = defineProps({
  target: {
    type: String,
  },
})

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const data = [
  {
    actions: ['回复'],
    author: '1Han Solo',
    avatar: 'https://ui-avatars.com/api?name=random&background=random',
    content:
      '1We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs('2023-07-16 22:54'),
  },
  {
    actions: ['回复'],
    author: '2Han Solo',
    avatar: 'https://ui-avatars.com/api?name=random2?background=random',
    content:
      '2We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(2, 'days'),
  },
]

const date2 = dayjs().subtract(1, 'days')
const quoteItem = reactive<any>({})
const textareaRef = ref()
const commentContent = ref<string>('')
const submitting = false
const formRef = ref<FormInstance>()
const isShowQuote = ref<boolean>(false)

const handleSubmit = () => {
  console.log(user)
  formRef.value!.validateFields()
}
const pagination = {
  onChange: (page: number) => {
    console.log(page)
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

const clickReply = (item: any) => {
  quoteItem.author = item.author
  quoteItem.avatar = item.avatar
  quoteItem.content = item.content
  quoteItem.datetime = item.datetime
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
