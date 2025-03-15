const options = {
    event: 'mousedown',
    transition: 400,
  }
  
  const vRipple = {
    beforeMount: (el, binding) => {
      if (binding.value === false) return
  
      const bg = el.getAttribute('ripple-background')
      setProps(Object.keys(binding.modifiers), options)
  
      const background = bg || vRipple.background
      const zIndex = vRipple.zIndex
  
      el.addEventListener(options.event, (event) => {
        rippler({
          event,
          el,
          background,
          zIndex,
        })
      })
    },
    updated(el, binding) {
      if (!binding.value) {
        el?.clearRipple?.()
        return
      }
      const bg = el.getAttribute('ripple-background')
      el?.setBackground?.(bg)
    },
  }
  
  function rippler({ event, el, zIndex, background }) {
    const targetBorder = parseInt(getComputedStyle(el).borderWidth.replace('px', ''))
    const clientX = event.clientX || event.touches[0].clientX
    const clientY = event.clientY || event.touches[0].clientY
  
    const rect = el.getBoundingClientRect()
    const { left, top } = rect
    const { offsetWidth: width, offsetHeight: height } = el
    const { transition } = options
    const dx = clientX - left
    const dy = clientY - top
    const maxX = Math.max(dx, width - dx)
    const maxY = Math.max(dy, height - dy)
    const style = window.getComputedStyle(el)
    const radius = Math.sqrt(maxX * maxX + maxY * maxY)
    const border = targetBorder > 0 ? targetBorder : 0
  
    const ripple = document.createElement('div')
    const rippleContainer = document.createElement('div')
  
    // Styles for ripple
    ripple.className = 'ripple'
  
    Object.assign(ripple.style ?? {}, {
      marginTop: '0px',
      marginLeft: '0px',
      width: '1px',
      height: '1px',
      transition: `all ${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      borderRadius: '50%',
      pointerEvents: 'none',
      position: 'relative',
      zIndex: zIndex ?? '80',
      backgroundColor: background ?? '#1890ff',
      opacity: 0.6,
    })
  
    // Styles for rippleContainer #1890ff
    rippleContainer.className = 'ripple-container'
    Object.assign(rippleContainer.style ?? {}, {
      position: 'absolute',
      left: `${0 - border}px`,
      top: `${0 - border}px`,
      height: '0',
      width: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
    })
  
    const storedTargetPosition = el.style.position.length > 0 ? el.style.position : getComputedStyle(el).position
  
    if (storedTargetPosition !== 'relative') {
      el.style.position = 'relative'
    }
  
    rippleContainer.appendChild(ripple)
    el.appendChild(rippleContainer)
  
    Object.assign(ripple.style, {
      marginTop: `${dy}px`,
      marginLeft: `${dx}px`,
    })
  
    const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = style
    Object.assign(rippleContainer.style, {
      width: `${width}px`,
      height: `${height}px`,
      direction: 'ltr',
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    })
  
    setTimeout(() => {
      const wh = `${radius * 2}px`
      Object.assign(ripple.style ?? {}, {
        width: wh,
        height: wh,
        marginLeft: `${dx - radius}px`,
        marginTop: `${dy - radius}px`,
      })
    }, 0)
  
    function clearRipple() {
      setTimeout(() => {
        ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }, 250)
  
      setTimeout(() => {
        rippleContainer?.parentNode?.removeChild(rippleContainer)
      }, 850)
      el.removeEventListener('mouseup', clearRipple, false)
      el.removeEventListener('mouseleave', clearRipple, false)
      el.removeEventListener('dragstart', clearRipple, false)
      setTimeout(() => {
        let clearPosition = true
        for (let i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].className === 'ripple-container') {
            clearPosition = false
          }
        }
  
        if (clearPosition) {
          el.style.position = storedTargetPosition !== 'static' ? storedTargetPosition : ''
        }
      }, options.transition + 260)
    }
  
    if (event.type === 'mousedown') {
      el.addEventListener('mouseup', clearRipple, false)
      el.addEventListener('mouseleave', clearRipple, false)
      el.addEventListener('dragstart', clearRipple, false)
    } else {
      clearRipple()
    }
  
    el.setBackground = (bgColor) => {
      if (!bgColor) {
        return
      }
      ripple.style.backgroundColor = bgColor
    }
  }
  
  function setProps(modifiers, props) {
    modifiers.forEach((item) => {
      if (isNaN(Number(item))) props.event = item
      else props.transition = item
    })
  }
  
  export default vRipple