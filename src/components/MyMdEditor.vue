<template class="editor">
  <v-md-editor
    v-model="content"
    height="600px"
    left-toolbar="undo redo clear | h bold italic strikethrough | code quote table tip hr location | image link | ul ol | save"
    autofocus="true"
    disabled-menus="[]"
    :toolbar="toolbar"
    @upload-image="onUploadImage"
    v-if="mode === 'edit'"
  ></v-md-editor>

  <v-md-preview :text="content" v-else></v-md-preview>
</template>

<script lang="ts" setup>
defineProps({
  content: String,
  mode: String,
})

// const emit = defineEmits(['upload-img'])

const onUploadImage = (event: any, insertImage: any, files: any) => {
  console.log(files)
  insertImage({
    url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
    desc: '七龙珠',
    width: 'auto',
    height: 'auto',
  })
}

const toolbar = {
  location: {
    title: '插入定位',
    icon: 'v-md-icon-loc',
    menus: [
      {
        name: 'left',
        text: '居左',
        action(editor: any) {
          editor.insert(function (selected: string) {
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
      },
      {
        name: 'center',
        text: '居中',
        action(editor: any) {
          editor.insert(function (selected: any) {
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
      },
      {
        name: 'right',
        text: '局右',
        action(editor: any) {
          editor.insert(function (selected: any) {
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
      },
    ],
  },
}
</script>

<style>
.v-md-icon-loc:before {
  content: 'L';
}
</style>
<style lang="less" scoped>
.editor {
  // :v-deep
}
</style>
