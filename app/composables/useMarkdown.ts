import MarkdownIt from 'markdown-it'
// Импортируем только core стили highlight.js, тему подключим отдельно
import hljs from 'highlight.js/lib/core'
// Подключаем только нужные языки для экономии бандла (Lazy loading languages is pointless for small apps)
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml' // HTML

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)

export const useMarkdown = () => {
  const md: MarkdownIt = new MarkdownIt({
    html: false, // Security: Disable HTML tags in source
    linkify: true, // Autoconvert URL-like text to links
    typographer: true, // Enable some language-neutral replacement + quotes beautification
    breaks: true, // Convert '\n' in paragraphs into <br>
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs code-block"><code>${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`
        } catch (__) {}
      }
      // Fallback for unknown languages or no language
      return `<pre class="hljs code-block"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })

  // Функция рендеринга
  const render = (content: string): string => {
    return md.render(content)
  }

  return {
    render
  }
}
