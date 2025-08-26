<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-modal v-model:visible="showApplyModel" width="450px" title="申请友链" ok-text="确认" cancel-text="取消"
        @ok="submitApply">
        <a-form ref="formRef" name="custom-validation" :model="formData" :rules="rules" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }">
          <a-form-item label="网站名称" name="title">
            <a-input v-model:value="formData.title" />
          </a-form-item>
          <a-form-item label="网站链接" name="link">
            <a-input v-model:value="formData.link" />
          </a-form-item>
          <a-form-item label="网站描述" name="slogan">
            <a-input v-model:value="formData.slogan" />
          </a-form-item>
          <a-form-item label="网站图标" name="avator">
            <a-input v-model:value="formData.avator" />
          </a-form-item>
        </a-form>
      </a-modal>

      <div class="main">
        <a-collapse default-active-key="" style="margin-bottom: 24px">
          <a-collapse-panel key="1" header="友链申请说明" :showArrow="true">
            <div>
              以下列表按照最近登录时间倒叙+申请时间正序排列，如果您的博客也想在这里展示请先添加本博客为友链然后点击<a class="link" @click="showApplyModel = true">申请</a>，
              本博客信息如下：
              <ul>
                <li>名称：菩提思</li>
                <li>地址：https://www.lindenthink.com</li>
                <li>标语：一花一世界，一叶一菩提。</li>
                <li>头像：https://www.lindenthink.com/logo.jpg</li>
              </ul>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <a-list :grid="{ gutter: 16, column: 3 }" :data-source="friends" :loading="loading" :empty-text="emptyText">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card v-ripple hoverable class="friend-card" style="width: 100%; height: 100%" @click="clickLink(item)">
                <a-card-meta :title="item.title" :description="item.slogan">
                  <template #avatar>
                    <a-avatar :src="item.avator" v-if="item.avator" />
                    <a-avatar v-else :style="{ backgroundColor: getRandomColor(), color: '#fff' }">
                      <span>{{ item.title.substring(0, 2) }}</span>
                    </a-avatar>
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <Comment owner="2" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import Comment from '@/components/Comment.vue'
import { save, queryFriends } from '@/services/materialService'

const showApplyModel = ref(false)
const friends = ref([])
const formRef = ref(null)
const formData = reactive({
  title: '',
  link: '',
  slogan: '',
  avator: '',
})

// 空状态文本
const emptyText = '暂无友链数据，点击右上角"申请友链"添加'
const loading = ref(false)

const rules = {
  title: [
    {
      required: true,
      message: '请输入网站名称',
      trigger: 'blur'
    },
    {
      max: 20,
      message: '网站名称不能超过20个字符',
      trigger: 'blur'
    },
  ],
  link: [
    {
      required: true,
      message: '请输入网站链接',
      trigger: 'blur'
    },
    {
      type: 'url',
      message: '请输入有效的URL地址',
      trigger: 'blur'
    },
  ],
  slogan: [
    {
      required: false,
      message: '请输入网站描述',
      trigger: 'blur'
    },
    {
      max: 50,
      message: '网站描述不能超过50个字符',
      trigger: 'blur'
    },
  ],
  avator: [
    {
      required: false,
      message: '请输入网站图标地址',
      trigger: 'blur'
    },
    {
      type: 'url',
      message: '请输入有效的图标URL地址',
      trigger: 'blur'
    },
  ],
}

watch(() => showApplyModel.value, (visible) => {
  if (visible) {
    nextTick(() => {
      formRef.value.resetFields()
    })
  }
})


const fetchFriends = async () => {
  loading.value = true
  try {
    const res = await queryFriends()
    friends.value = res.map(item => JSON.parse(item.content))
  } catch (error) {
    console.error(error)
    message.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchFriends()
})

const submitApply = async () => {
  if (!formRef.value) return
  // 执行表单验证
  await formRef.value.validateFields()
  await save({
    type: 'FRIEND',
    content: JSON.stringify(formData)
  })
  message.success('申请成功，等待审核')
  showApplyModel.value = false
  formRef.value.resetFields()
  fetchFriends()
}

const clickLink = (item) => {
  Modal.confirm({
    title: '提示',
    content: '您即将离开本网站，前往：' + item.link,
    okText: '继续访问',
    cancelText: '取消',
    onOk() {
      window.open(item.link, '_blank')
    }
  })
}

// 生成随机柔和颜色
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 10); // 45-55%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
</script>

<style scoped lang="less">
.main {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .link {
    color: #1890ff;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      color: #40a9ff;
      text-decoration: underline;
    }
  }

  .friend-card {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
