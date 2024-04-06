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
          :model="linkRequest"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item has-feedback label="标题" name="title">
            <a-input v-model:value="linkRequest.title" />
          </a-form-item>
          <a-form-item has-feedback label="链接" name="url">
            <a-input v-model:value="linkRequest.url" />
          </a-form-item>
          <a-form-item has-feedback label="标语" name="slogan">
            <a-input v-model:value="linkRequest.slogan" />
          </a-form-item>
          <a-form-item has-feedback label="头像" name="avator">
            <a-input v-model:value="linkRequest.avator" />
          </a-form-item>
        </a-form>
      </a-modal>
     
      <div class="main">
         <a-alert message="说明" type="info" show-icon>
        <template #description>
          以下列表按照最近登录时间倒叙+申请时间正序排列，如果您的博客也想在这里展示请先添加本博客为友链然后点击<a style="font-size: 1.2em;font-weight: bold;"
            @click="showApplyModel = true"
            >申请</a
          >，本博客信息如下：
          <ul>
            <li>名称：菩提思</li>
            <li>地址：https://www.lindenthink.com</li>
            <li>标语：一花一世界，一叶一菩提</li>
            <li>头像：https://www.lindenthink.com/logo.jpg</li>
          </ul>
        </template>
      </a-alert>
        <a-list :grid="{ gutter: 1 }" :data-source="data" style="margin-top: 20px;padding:10px;">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card hoverable style="width: 240px" @click="clickLink(item)" v-ripple>
                <a-card-meta title="菩提思" description="一花一世界，一叶一菩提">
                  <template #avatar>
                    <a-avatar src="/logo.jpg" />
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <MyComment />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import MyComment from '@/components/MyComment.vue'

const showApplyModel = ref(false)
const data = [1, 2, 3, 4]
const linkRequest = ref({})
const rules = ref({})

const submitApply = () => {}

const clickLink = (item: any) => window.open('https://www.baidu.com', '_blank')
</script>

<style scoped lang="less">
:deep(.ant-row) {
  justify-content: space-between;
}
.ant-layout-content {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
  min-width: 780px;
}

.main {
  padding: 20px 20px 10px 20px;
  background: #fff;
}
</style>
