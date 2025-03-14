export function useLive2d() {
  const takeRandom = (target) => {
    return window.pickRandom(target)
  }

  const showMessage = (text, timeout = 3000) => {
    return window.showMessage(text, timeout)
  }

  const bindTip = () => {
    return window.bindTip()
  }

  return {
    takeRandom,
    showMessage,
    bindTip,
  }
}