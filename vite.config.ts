import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
// 当前项目没有使用compression插件，从package.json来看使用的是vite-plugin-compression2，但当前未启用
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
// https://github.com/anncwb/vite-plugin-mock/blob/main/README.zh_CN.md
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'
  const plugins = [
    vue(),
    viteMockServe({
      mockPath: 'mock', // 模拟数据文件存放的目录
      enable: true, // 开启
    })
  ]
  
  // 仅在analyze模式下添加visualizer插件
  if (isAnalyze) {
    plugins.push(visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }) as any)
  }
  
  return {
    plugins: plugins,

    resolve: {
      alias: {
        '@': '/src',
      },
    },

    server: {
      port: 3001,
    },
    
    build: {
      // 代码分割优化
      rollupOptions: {
        output: {
          manualChunks: {
            // 将vue相关库单独打包
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // 将工具库单独打包
            'utils': ['dayjs'],
            // 将大型第三方库单独打包
            'asciidoctor': ['@asciidoctor/core'],
            'asciidoctor-kroki': ['asciidoctor-kroki'],
            'hljs': ['highlight.js'],
            // 将UI库单独打包
            'ui-library': ['ant-design-vue'],
          },
          // 文件名哈希优化
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      // 构建目标
      target: 'es2015',
      // 启用最小化压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除console
          drop_debugger: true // 移除debugger
        }
      },
      //  chunk 大小警告的限制
      chunkSizeWarningLimit: 1000,
      // 源码映射
      sourcemap: false, // 生产环境关闭sourcemap
    },
  }
})