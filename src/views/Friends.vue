<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-modal
        v-model:visible="showApplyModel"
        width="450px"
        title="申请友链"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitApply"
      >
        <a-form
          ref="formRef"
          name="custom-validation"
          :model="formData"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item has-feedback label="标题" name="title">
            <a-input v-model:value="formData.title" />
          </a-form-item>
          <a-form-item has-feedback label="链接" name="link">
            <a-input v-model:value="formData.link" />
          </a-form-item>
          <a-form-item has-feedback label="标语" name="slogan">
            <a-input v-model:value="formData.slogan" />
          </a-form-item>
          <a-form-item has-feedback label="头像" name="avator">
            <a-input v-model:value="formData.avator" />
          </a-form-item>
        </a-form>
      </a-modal>

      <div class="main">
        <a-alert message="说明" type="info" show-icon>
          <template #description>
            以下列表按照最近登录时间倒叙+申请时间正序排列，如果您的博客也想在这里展示请先添加本博客为友链然后点击<a
              class="link"
              @click="showApplyModel = true"
              >申请</a
            >， 本博客信息如下：
            <ul>
              <li>名称：菩提思</li>
              <li>地址：https://www.lindenthink.com</li>
              <li>标语：一花一世界，一叶一菩提</li>
              <li>头像：https://www.lindenthink.com/logo.jpg</li>
            </ul>
          </template>
        </a-alert>
        <a-list :grid="{ gutter: 1 }" :data-source="friends" style="margin-top: 20px" :loading="loading">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card v-ripple hoverable style="width: 240px" @click="clickLink(item)">
                <a-card-meta :title="item.title" :description="item.slogan">
                  <template #avatar>
                    <a-avatar :src="item.avator" />
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <Comment owner="1" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { message } from 'ant-design-vue'
import Comment from '@/components/Comment.vue'
import { getFriends, addFriend } from '@/services/friendService'

const showApplyModel = ref(false)
const friends = ref([])
const formRef = ref(null)
const formData = reactive({})
const loading = ref(false)

const rules = {
  title: [
    {
      required: true,
      message: '请输入标题',
    },
    {
      max: 16,
      message: '标题不能超过16个字符',
    },
  ],
  link: [
    {
      required: true,
      message: '请输入链接',
    },
  ],
  slogan: [
    {
      required: false,
      message: '请输入标语',
    },
    {
      max: 32,
      message: '标语不能超过32个字符',
    },
  ],
  avator: [
    {
      required: false,
      message: '请输入头像地址',
    },
  ],
}

onBeforeMount(async () => {
  loading.value = true
  try {
    const res = await getFriends()
    friends.value = res.data
  } catch (error) {
    console.error(error)
    message.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
})

const submitApply = async () => {
  try {
    await formRef.value.validate()
    await addFriend(formData)
    friends.value.push(JSON.parse(JSON.stringify(formData)))
    showApplyModel.value = false
    message.success('申请成功')
    formRef.value.resetFields()
  } catch (error) {
    console.error(error)
    message.error('申请失败: ' + error.message)
  }
}

const clickLink = (item) => window.open(item.link, '_blank')
</script>

<style scoped lang="less">
:deep(.ant-row) {
  justify-content: space-between;
}

.main {
  padding: 20px 20px 10px 20px;
  background: #fff;

  .link {
    font-size: 1.2em;
    font-weight: bold;
  }
}
</style>
