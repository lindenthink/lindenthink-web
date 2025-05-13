<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <div class="tools-container">
        <!-- 主功能Tab页 -->
        <a-tabs v-model:active-key="activeKey" animated>
          <a-tab-pane v-for="tool in tools" :key="tool.title" :tab="tool.title">
            <div class="btns">
              <a-space wrap :size="[12, 12]">
                <span class="label">{{ tool.title }}</span>
                <template v-for="child in tool.children" :key="child.title">
                  <a-button class="sub-tool-btn" type="primary" ghost @click="router.push(child.path)">
                    {{ child.title }}
                  </a-button>
                </template>
              </a-space>
            </div>
          </a-tab-pane>
        </a-tabs>

        <!-- 快捷入口按钮组 -->
        <div class="btns">
          <a-space wrap :size="[10, 10]">
            <span class="label">常用</span>
            <a-button
              v-for="entry in quickEntries"
              :key="entry.title"
              type="primary"
              ghost
              shape="round"
              class="quick-btn"
              @click="router.push(entry.path)"
            >
              {{ entry.quickName }}
            </a-button>
          </a-space>
        </div>

        <!-- 内容区域 -->
        <div class="content-area">
          <router-view></router-view>
        </div>
      </div>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CodeFilled } from '@ant-design/icons-vue'

const router = useRouter()
const activeKey = ref('格式化')

onMounted(() => {
  const pathname = location.pathname
  if (!pathname.includes('tools/')) {
    router.push({ path: '/tools' })
  }
  activeKey.value = tools.find((tool) => tool.children.some((child) => child.path === pathname))?.title || '格式化'
})

const tools = [
  {
    title: '格式化',
    icon: CodeFilled,
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
      { title: 'RSA', path: '/tools/encrypt-rsa' },
      { title: 'AES', path: '/tools/encrypt-aes', quickEntry: true, quickName: `AES加解密` },
    ],
  },
  {
    title: '摘要',
    children: [
      { title: 'MD5', path: '/tools/digest-md5', quickEntry: true, quickName: 'MD5' },
      { title: 'SHA1', path: '/tools/digest-sha1' },
      { title: 'SHA256', path: '/tools/digest-sha256' },
      { title: 'HMAC', path: '/tools/digest-hmac' },
    ],
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
      { title: '密码管理', path: '/tools/password-manager' },
    ],
  },
  {
    title: '比对',
    children: [
      {
        title: '文本比对',
        path: '/tools/text-diff',
        quickEntry: true,
        quickName: '文本比对',
      },
    ],
  },
]
const quickEntries = tools.flatMap((tool) =>
  tool.children
    .filter((child) => child.quickEntry)
    .map((child) => ({
      ...child,
      icon: tool.icon,
    })),
)
</script>

<style scoped lang="less">
@tools-color: #1890ff;

.btn {
  height: 26px;
  padding: 0 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.label {
  display: inline-block;
  width: 50px;
  font-size: 13px;
  padding-left: 4px;
  border-left: #1890ff 2px solid;
}

.tools-container {
  margin: 10px auto;
  padding: 0 24px;

  .btns {
    margin: 12px 0;

    .sub-tool-btn {
      .btn();

      &:hover {
        transform: translateY(-2px);
        color: @tools-color;
      }
    }

    .quick-btn {
      .btn();
      border: none;
      background: linear-gradient(45deg, @tools-color, #40a9ff);
      color: white;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
