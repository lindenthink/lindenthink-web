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
          console.error(e)
          formatted.value = { error: `无效的 ${lang}` }
        }
        output.value = JSON.stringify(formatted.value, null, 2)
        break
      case 'sql':
        var [{ format }, hljsSql] = await Promise.all([import('sql-formatter'), import('highlight.js/lib/core')])
        var temp = format(code)
        hljsSql.default.registerLanguage('sql', (await import('highlight.js/lib/languages/sql')).default)
        formatted.value = hljsSql.default.highlight(temp, { language: 'sql' }).value
        output.value = temp
        break
      case 'html':
      case 'xml':
        var [vkbeautify, hljsXml] = await Promise.all([import('vkbeautify'), import('highlight.js/lib/core')])
        hljsXml.default.registerLanguage('xml', (await import('highlight.js/lib/languages/xml')).default)
        var formattedXml = vkbeautify.default.xml(code, 2)
        formatted.value = hljsXml.default.highlight(formattedXml, { language: 'xml' }).value
        output.value = formattedXml
        break
      default:
        formatted.value = { error: `不支持的 ${lang}` }
    }
  }

  return { formatted, output, highlight }
}
