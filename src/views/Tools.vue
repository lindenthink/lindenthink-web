<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <div class="tools">
        <div class="tools-menu">

          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              格式化
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <router-link to="/tools/format-json">JSON</router-link>
                </a-menu-item>
                <a-menu-item key="2">
                  <router-link to="/tools/format-xml">XML</router-link>
                </a-menu-item>
                <a-menu-item key="3">
                  <router-link to="/tools/format-sql">SQL</router-link>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              编解码
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">Base64</a-menu-item>
                <a-menu-item key="2">Unicode</a-menu-item>
                <a-menu-item key="3">URL</a-menu-item>
                <a-menu-item key="4">Ascii</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              加解密
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu @click="onClick">
                <a-menu-item key="1">AES</a-menu-item>
                <a-menu-item key="2">DES</a-menu-item>
                <a-menu-item key="3">RSA</a-menu-item>
                <a-menu-item key="4">SM</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              转换
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu @click="onClick">
                <a-menu-item key="1">时间戳</a-menu-item>
                <a-menu-item key="2">二维码</a-menu-item>
                <a-menu-item key="3">Cron表达式</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
  router.push({ path: '/tools' })
})

</script>

<style scoped lang="less">
.tools {
  padding: 10px;
  margin: 10px;
  .tools-menu {
    border: 1px solid #f0f2f5;
    padding: 10px ;
    margin-bottom: 10px;
  }
}
</style>