<template>
  <my-md-editor mode="preview" :content="text"></my-md-editor>

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
              <p>
                {{ item.content }}
              </p>
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
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item :name="'name'" :rules="[{ required: true, message: '昵称不能为空' }]">
                <a-input v-model:value="user.name" placeholder="昵称">
                  <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :name="'email'" :rules="[{ type: 'email', message: '邮箱格式不正确' }]">
                <a-input v-model:value="user.email" placeholder="邮箱">
                  <template #prefix><MailOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :name="'link'" :rules="[{ type: 'url', message: '链接格式不正确' }]">
                <a-input v-model:value="user.link" placeholder="链接">
                  <template #prefix><LinkOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <transition name="fade">
              <div class="quote" v-if="isShowQuote === true">
                <a-comment :author="quoteItem.author" :avatar="quoteItem.avatar">
                  <template #content> {{ quoteItem.content }} </template>
                  <template #datetime>
                    <a-tooltip :title="date2.format('YYYY-MM-DD HH:mm:ss')">
                      <span>{{ quoteItem.datetime.fromNow() }}</span>
                    </a-tooltip>
                  </template>
                </a-comment>

                <a-button type="text" @click="isShowQuote = false">
                  <template #icon><CloseCircleOutlined style="color: grey" /></template>
                </a-button>
              </div>
            </transition>
            <a-textarea v-model:value="commentContent" :rows="4" show-count :maxlength="200" />
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
import { ref, reactive,onMounted } from 'vue'
import { UserOutlined, MailOutlined, LinkOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import MyMdEditor from '@/components/MyMdEditor.vue'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

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
  name: '',
  email: '',
  link: '',
})

const text = `
![Description](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fe225e6b91b0a8012165181d5852.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657537831&t=d226c5546488b11b60c438be60547b3a)
## 关于我
一个默默无闻的后端开发，有着远大的理想抱负但缺总三天打鱼两天晒网，平凡缺不甘于平凡。每天在和自己做抗争，不想这么虚度光阴，希望自己的人生是充实的。

平时喜欢折腾，虽然工作是后端开发，但很喜欢前端的一些技术，因为能偶做出一个页面会特别的有成就感。看了几本书籍和教程视频，平时也有关注前端的最新动态，对前端有了基础的认知，也能做些前端的工作。

喜欢古风，尤其痴迷优美的诗句和歌曲，陶醉其中。为生活奔波忙碌的我们，偶尔也要停下脚步欣赏沿途的美好，对未来充满期待脚步才会更加轻快。

## 关于本站
在开始本站开发之前已经摸索了很长一段时间，对比了很多博客框架后一度认为\`Hexo\`满足了我的需要，为此花了很多时间和精力去补充和调整，也在基于Hexo实现的博客网站上写了几篇文章。

但后面发现静态网站很难扩展，很多想法不好实现，所以决定自己来实现个人网站。做起来还是挺难的，前后花了很长时间去搜索相关的实现。过程中碰上Vue3发布就试着用了下，但可参考的文档还比较少，不少概念理解起来比较困难就搁置了一段时间。

自己实现的念想一直没断过
## 愿景
网站还在不断完善中，希望自己能够更加有动力去学习和记录，也希望能给他人带来些许的参考和帮助。

努力永远不会太迟，不负韶华不负自己，共勉！
`
const data = [
  {
    actions: ['回复'],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(1, 'days'),
  },
  {
    actions: ['回复'],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(2, 'days'),
  },
]
const date2 = dayjs().subtract(1, 'days')
const quoteItem = reactive<any>({})
const clickReply = (item: any) => {
  quoteItem.author = item.author
  quoteItem.avatar = item.avatar
  quoteItem.content = item.content
  quoteItem.datetime = item.datetime
  window.scrollTo(0, document.body.scrollHeight)
  isShowQuote.value = true
}
</script>

<style lang="less" scoped>
.comment {
  padding: 10px;
  margin-top: 10px;
  background-color: white;
}

.quote {
  display: flex;
  justify-content: space-between;
  padding: 0 1px 0 10px;
  border-left: 5px solid rgb(222, 222, 222);
  background-color: rgb(243, 242, 242);
  margin-bottom: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// :deep(.ant-list-pagination) {
//   text-align: right;
//   padding-bottom: 10px;
//   margin-top: 24px;
// }
</style>
