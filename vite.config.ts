import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
// https://github.com/anncwb/vite-plugin-mock/blob/main/README.zh_CN.md
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock', // 模拟数据文件存放的目录
      enable: true, // 开启
  }),
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    port: 3001,
  },
})
