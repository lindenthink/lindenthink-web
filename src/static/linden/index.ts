const TagColors = ['pink', 'green', 'red', 'cyan', 'orange', 'blue', 'purple']

function takeRandom(target: any) {
  return (window as any).pickRandom(target)
}

function showMessage(text: string, timeout: number = 3000) {
  return (window as any).showMessage(text, timeout)
}

/**
 * 绑定live2d事件，比如鼠标悬浮在超链接触发提示。
 */
function bindTip() {
  return (window as any).bindTip()
}

export { TagColors, takeRandom, showMessage, bindTip }
