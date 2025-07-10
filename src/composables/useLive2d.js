export default function useLive2d() {
  const takeRandom = (target) => {
    return window.pickRandom(target)
  }

  const showMessage = (text, timeout = 3000) => {
    if (window.showMessage) {
      return window.showMessage(text, timeout)
    }
  }

  const bindTip = () => {
    if (window.bindTip) {
      return window.bindTip()
    }
  }

  return {
    takeRandom,
    showMessage,
    bindTip,
  }
}
