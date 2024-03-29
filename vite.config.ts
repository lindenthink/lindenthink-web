import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjs from 'vite-plugin-prismjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    prismjs({
      languages: ['json', 'js', 'css', 'python', 'markup', 'sql', 'scss', 'less', 'ts', 'py', 'yml', 'bash', 'java'],
    }),
    vue(),
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
