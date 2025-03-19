<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <div class="tools">
        <div class="tools-menu">
          <template v-for="(tool, index) in tools" :key="tool.title">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                {{ tool.title }}
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="child in tool.children" :key="child.title">
                    <router-link :to="child.path">{{ child.title }}</router-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-divider v-if="index !== tools.length - 1" type="vertical" />
          </template>
          <a-divider dashed plain><span style="color: lightgrey;">快捷入口</span></a-divider>
          <div class="tools-quick-entry">
            <router-link v-for="child in quickEntries" :key="child.title" :to="child.path" class="quick-entry-link">
              {{ child.quickName }}
            </router-link>
          </div>
        </div>

        <div class="tools-body">
          <router-view> </router-view>
        </div>
      </div>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DownOutlined } from '@ant-design/icons-vue'

const router = useRouter()
onMounted(() => {
  const pathname = location.pathname
  if (!pathname.includes('tools\/')) {
    router.push({ path: '/tools' })
  }
})

const tools = [
  {
    title: '格式化',
    children: [
      { title: 'JSON', path: '/tools/format-json', quickEntry: true, quickName: 'JSON格式化' },
      { title: 'XML', path: '/tools/format-xml' },
      { title: 'SQL', path: '/tools/format-sql' },
    ],
  },
  {
    title: '编解码',
    children: [
      { title: 'BASE64', path: '/tools/encode-base64', quickEntry: true, quickName: 'BASE64编解码' },
      { title: 'URL', path: '/tools/encode-url' },
      { title: 'Unicode', path: '/tools/encode-unicode' },
      { title: 'Ascii', path: '/tools/encode-ascii' },
    ],
  },
  {
    title: '加解密',
    children: [
      { title: 'RSA', path: '/tools/encrypt-rsa', quickEntry: true, quickName: `RSA加解密` },
      { title: 'AES', path: '/tools/encrypt-aes' },
    ],
  },
  {
    title: '摘要',
    children: [
      { title: 'MD5', path: '/tools/digest-md5', quickEntry: true, quickName: 'MD5' },
      { title: 'SHA1', path: '/tools/digest-sha1' },
      { title: 'SHA256', path: '/tools/digest-sha256' },
      { title: 'HMAC', path: '/tools/digest-hmac' },
    ]
  },
  {
    title: '转换',
    children: [
      { title: '时间戳', path: '/tools/convert-timestamp', quickEntry: true, quickName: '时间戳转换' },
      { title: 'Cron表达式', path: '/tools/convert-cron', quickEntry: true, quickName: 'Cron校验解释' },
    ],
  },
  {
    title: '图片',
    children: [
      { title: 'BASE64', path: '/tools/image-base64' },
      { title: '二维码', path: '/tools/image-qrcode', quickEntry: true, quickName: '二维码生成' },
    ],
  },
  {
    title: '密码', // 密码生成，密码管理
    children: [
      { title: '密码生成', path: '/tools/password-generator', quickEntry: true, quickName: '密码生成' },
      { title: '密码管理', path: '/tools/password-manager', },
    ]
  },
]
const quickEntries = tools.flatMap(tool => tool.children.filter(child => child.quickEntry))
</script>

<style scoped lang="less">
.tools {
  padding: 10px;
  margin: 10px;

  .tools-menu {
    border: 1px solid #f0f2f5;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tools-quick-entry {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .quick-entry-link {
      padding: 0px 5px;
      border: 1px solid #afaeae;
      border-radius: 4px;
      text-decoration: none;
      color: #afaeae;
      transition: background-color 0.3s;

      &:hover {
        color: #1890ff;
        border-color: #1890ff;
      }
    }
  }
}

.ant-divider-horizontal.ant-divider-with-text {
  margin: 5px 0;
}
</style>