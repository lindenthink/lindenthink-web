<template>
  <div ref="playerRef"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

import APlayer from 'aplayer'
import 'aplayer/dist/APlayer.min.css'
import useLive2d from '@/composables/useLive2d'
import useApiFetch from '@/composables/useApiFetch'


let props = defineProps({
  // 开启吸底模式
  fixed: {
    type: Boolean,
    default: true,
  },
  // 开启迷你模式
  mini: {
    type: Boolean,
    default: true,
  },
  // 音频自动播放
  autoplay: {
    type: Boolean,
    default: true,
  },
  // 主题色
  theme: {
    type: String,
    default: '#48abe9',
  },
  // 传递歌词方式
  lrcType: {
    type: Number,
    default: 3,
  },
  // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
  mutex: {
    type: Boolean,
    default: true,
  },
  // 存储播放器设置的 localStorage key
  storageName: {
    type: String,
    default: 'aplayer',
  },
  // 播放类型(song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家)
  songType: {
    type: String,
    default: 'playlist',
  },
  // 音频循环播放
  loop: {
    type: String,
    default: 'all',
    validator: (value) => {
      return value === 'all' || value === 'one' || value === 'none'
    },
  },
  // 音频循环顺序
  order: {
    type: String,
    default: 'random',
    validator: (value) => {
      return value === 'list' || value === 'random'
    },
  },
  // 预加载
  preload: {
    type: String,
    default: 'auto',
    validator: (value) => {
      return value === 'auto' || value === 'metadata' || value === 'none'
    },
  },
  // 默认音量
  volume: {
    type: Number,
    default: 0.7,
    validator: (value) => {
      return value >= 0 && value <= 1
    },
  },
  // 列表是否默认折叠
  listFolded: {
    type: Boolean,
    default: true,
  },
  // 列表最大高度
  listMaxHeight: {
    type: String,
    default: '180px',
  },
  id: {
    type: String,
    default: '6991674483',
  },
})

const playerRef = ref()
// 也可以使用一言提供的接口：https://developer.hitokoto.cn/sentence/demo/#javascript
// const url = `https://api.i-meto.com/meting/api?server=netease&type=${props.songType}&id=${props.id}&r=${Math.random}`
const fetch = useApiFetch()

let ap
let abortController = null

// 封装加载音频的方法
const loadAudio = async (newId) => {
  // 如果有正在进行的请求，取消它
  if (abortController) {
    abortController.abort()
  }

  // 如果已有播放器实例，销毁它
  if (ap) {
    ap.destroy()
    ap = null
  }

  try {
    abortController = new AbortController()
    const url = `/netease/audio/playlist?id=${newId}`
    const data = await fetch(url, { signal: abortController.signal })

    await nextTick()
    if (!playerRef.value) {
      return
    }
    ap = new APlayer({
      container: playerRef.value,
      fixed: props.fixed,
      mini: props.mini,
      autoplay: props.autoplay,
      theme: props.theme,
      loop: props.loop,
      order: props.order,
      preload: props.preload,
      volume: props.volume,
      mutex: props.mutex,
      lrcType: props.lrcType,
      listFolded: props.listFolded,
      listMaxHeight: props.listMaxHeight,
      storageName: props.storageName,
      audio: data,
    })

    // 保留原有的事件监听逻辑
    let needNotify = true
    const { showMessage } = useLive2d()
    ap.on('canplay', () => {
      if (needNotify) {
        showMessage('音乐已加载完成，可以点击左下角播放按钮进行欣赏哦！', 5000)
      }
      needNotify = false
    })
    ap.on('pause', () => {
      showMessage('已暂停播放音乐！', 3000)
    })
    ap.on('play', () => {
      let music = data.find((item) => item.url === ap.audio.src)
      showMessage(`开始播放 <span style=\"color:rgb(165, 163, 163)\">${music.author}</span> 演唱的『${music.title}』`, 3000)
    })
    ap.on('lrchide', () => {
      showMessage('已隐藏歌词！', 3000)
    })
    ap.on('lrcshow', () => {
      showMessage('已显示歌词！', 3000)
    })

  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('加载音频失败:', error)
      const { showMessage } = useLive2d()
      showMessage('音频加载失败，请稍后重试', 3000)
    }
  }
}



onMounted(() => {
  loadAudio(props.id)
})

// 监听id变化，重新加载音频
watch(
  () => props.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      const { showMessage } = useLive2d()
      showMessage('正在切换播放列表...', 2000)
      loadAudio(newId)
    }
  }
)

onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort()
  }
  if (ap) {
    ap.destroy()
    ap = null
  }
})
</script>
