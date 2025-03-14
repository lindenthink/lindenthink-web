import { ref } from 'vue'

export function useHljs() {
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
      default:
        formatted.value = { error: `不支持的 ${lang}` }
    }
  }

  return { formatted, output, highlight }
}