<template>
  <a-layout>
    <a-layout-sider>
      <!-- 快捷入口按钮组 -->
      <a-card title="常用工具" :bordered="false" class="quick-btns">
        <div class="btns">
          <a-space wrap :size="[5, 5]">
            <a-button v-for="entry in quickEntries" :key="entry.title" type="primary" ghost shape="round"
              class="quick-btn" @click="router.push(entry.path)">
              {{ entry.quickName }}
            </a-button>
          </a-space>
        </div>
      </a-card>

    </a-layout-sider>
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

        <!-- 内容区域 -->
        <div>
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
    title: '文本',
    children: [
      {
        title: '文本比对',
        path: '/tools/text-diff',
        quickEntry: true,
        quickName: '文本比对',
      },
      {
        title: '正则匹配',
        path: '/tools/text-regular',
        quickEntry: true,
        quickName: '正则匹配',
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
@primary-color: #1890ff;
@hover-color: #40a9ff;

.btn {
  height: 24px;
  padding: 0 10px;
  border-radius: 10px;
}

.tools-container {
  margin: 10px 0 20px 0;
  padding: 0 24px;
}

.quick-btns {
  background-color: #fff;
  position: sticky;
  top: 120px;
  z-index: 9;
  margin-right: 10px;
  padding: 10px 0px 0px 0px;
  max-width: 200px;
  left: 12%;
}

// 按钮组统一样式
.btns {
  margin: 0 0 12px 0;
  border-radius: 8px;

  .label {
    font-size: 14px;
    font-weight: 500;
    color: @primary-color;
    padding: 0 12px 0 0;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 16px;
      background: @primary-color;
      margin-right: 8px;
    }
  }

  // 分类工具按钮
  .sub-tool-btn {
    .btn();
    border: 1px solid fadeout(@primary-color, 80%);
    background: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px fadeout(@primary-color, 80%);
      border-color: @primary-color;
      color: @primary-color !important;

      &::after {
        content: '→';
        margin-left: 8px;
        opacity: 0.8;
      }
    }
  }

  // 快捷入口按钮
  .quick-btn {
    .btn();
    background: linear-gradient(135deg, @primary-color, @hover-color);
    color: white !important;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s;
    }

    &:hover {
      box-shadow: 0 4px 16px fadeout(@primary-color, 50%);

        &::before {
          left: 100%;
        }
      }
    }
  }
</style>
