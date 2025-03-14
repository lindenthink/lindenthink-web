import { ref } from 'vue'

export function useFormat() {
  const formatted = ref('')
  const output = ref('')

  const highlight = async (code, lang) => {
    switch (lang) {
      case 'json':
        try {
          formatted.value = JSON.parse(code)
        } catch (e) {
          formatted.value = { error: `无效的 ${lang}` }
        }
        output.value = JSON.stringify(formatted.value, null, 2)
        break
      case 'sql':
        const [{ format }, hljs, sql] = await Promise.all([
          import('sql-formatter'),
          import('highlight.js/lib/core'),
          import('highlight.js/lib/languages/sql'),
        ])
        const temp = format(code)
        hljs.default.registerLanguage('sql', sql.default)
        formatted.value = hljs.default.highlight(temp, { language: 'sql' }).value
        output.value = temp
        break
      case 'html':
      case 'xml':
        const [hljsXml] = await Promise.all([
          import('highlight.js/lib/core'),
          import('highlight.js/lib/languages/xml'),
        ])
        hljsXml.default.registerLanguage('xml', (await import('highlight.js/lib/languages/xml')).default)
        const formattedXml = formatXml(code)
        formatted.value = hljsXml.default.highlight(formattedXml, { language: 'xml' }).value
        output.value = formattedXml
        break
      case 'css':
        const [hljsCss] = await Promise.all([
          import('highlight.js/lib/core'),
          import('highlight.js/lib/languages/css'),
        ])
        hljsCss.default.registerLanguage('css', (await import('highlight.js/lib/languages/css')).default)
        const formattedCss = formatCss(code)
        formatted.value = hljsCss.default.highlight(formattedCss, { language: 'css' }).value
        output.value = formattedCss
        break
      default:
        formatted.value = { error: `不支持的 ${lang}` }
    }
  }

  const formatXml = (xml) => {
    const PADDING = ' '.repeat(2) // set desired indent size here
    const reg = /(>)(<)(\/*)/g
    let pad = 0
    xml = xml.replace(reg, '$1\r\n$2$3')
    return xml.split('\r\n').map((node) => {
      let indent = 0
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1
        }
      } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
        indent = 1
      } else {
        indent = 0
      }

      pad += indent
      return PADDING.repeat(pad - indent) + node
    }).join('\r\n')
  }

  const formatCss = (css) => {
    const PADDING = ' '.repeat(2) // set desired indent size here
    const reg = /(\{|\}|;)/g
    let pad = 0
    css = css.replace(reg, '$1\r\n')
    return css.split('\r\n').map((line) => {
      let indent = 0
      if (line.match(/\}/)) {
        if (pad !== 0) {
          pad -= 1
        }
      } else if (line.match(/\{/)) {
        indent = 1
      } else {
        indent = 0
      }

      pad += indent
      return PADDING.repeat(pad - indent) + line
    }).join('\r\n')
  }

  return { formatted, output, highlight }
}