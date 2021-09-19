<template>
  <v-md-editor v-model="md"
  height ="600px" 
  left-toolbar="undo redo clear | h bold italic strikethrough | code quote table tip hr location | image link | ul ol | save" 
  autofocus="true"
  :disabled-menus="[]"
  :toolbar="toolbar"
  @upload-image="handleUploadImage"></v-md-editor>
  <!-- <v-md-preview :text="text"></v-md-preview> -->

</template>

<style>

</style>


<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue'

const toolbar = ref('')
toolbar.value =  {
      location: {
        title: '插入定位',
        icon: 'v-md-icon-loc',
           menus: [
          {
            name: 'left',
            text: '居左',
            action(editor:any) {
              editor.insert(function (selected:any) {
                const prefix = '::: align-left\n'
                const suffix = '\n:::'
                const placeholder = '请输入文本'
                const content = selected || placeholder
                return {
                  text: `${prefix}${content}${suffix}`,
                  selected: content,
                }
              })
            },
          },{
            name: 'center',
            text: '居中',
            action(editor:any) {
              editor.insert(function (selected:any) {
                const prefix = '::: align-center\n'
                const suffix = '\n:::'
                const placeholder = '请输入文本'
                const content = selected || placeholder
                return {
                  text: `${prefix}${content}${suffix}`,
                  selected: content,
                }
              })
            },
          },{
            name: 'right',
            text: '局右',
            action(editor:any) {
              editor.insert(function (selected:any) {
                const prefix = '::: align-right\n'
                const suffix = '\n:::'
                const placeholder = '请输入文本'
                const content = selected || placeholder
                return {
                  text: `${prefix}${content}${suffix}`,
                  selected: content,
                }
              })
            },
          }
        ],
      }
    } as any
</script>

<script lang='ts'>
  export default {
    data() {
      return {
        text: ''
      }
    },
    methods: {
      handleUploadImage(event:any, insertImage:any, files:any) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      console.log(files);
      // 此处只做示例
      insertImage({
        url:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        desc: '七龙珠',
        width: 'auto',
        height: 'auto',
      })
    },
    }
  }
</script>
<style>
.v-md-icon-loc:before{content:"L"}
</style>