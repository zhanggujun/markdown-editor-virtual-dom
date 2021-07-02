import marked from 'marked'

const renderer = new marked.Renderer()
const languages = ['cpp', 'xml', 'bash', 'coffeescript', 'css', 'markdown', 'http', 'java', 'javascript', 'json', 'less', 'makefile', 'nginx', 'php', 'python', 'scss', 'sql', 'stylus','js','https']

const Hljs = require('highlight.js/lib/highlight')
Hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
Hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
Hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
Hljs.registerLanguage('coffeescript', require('highlight.js/lib/languages/coffeescript'))
Hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
Hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
Hljs.registerLanguage('http', require('highlight.js/lib/languages/http'))
Hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
Hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
Hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
Hljs.registerLanguage('less', require('highlight.js/lib/languages/less'))
Hljs.registerLanguage('makefile', require('highlight.js/lib/languages/makefile'))
Hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'))
Hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
Hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
Hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
Hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
Hljs.registerLanguage('stylus', require('highlight.js/lib/languages/stylus'))
Hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))

Hljs.configure({
  classPrefix: 'hljs-'     // don't append class prefix
})


marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code,lang){
    if (!~languages.indexOf(lang)) {
      return Hljs.highlightAuto(code).value
    }
    return Hljs.highlight(lang, code).value
  }
})

// 段落解析
const paragraphParse = text => {
  if(!text)
    return ''
  return `<p class="marked-paragraph">${text}</p>`
}

// 对图片进行弹窗处理, 及懒加载处理
const imageParse = (src, title, alt) => {
  if(!src)
    return ''
  const { lazy = false } = renderer
  const _src = lazy ? 'https://static.vvxiayutian.com/static/placeholder.jpg' : src
  let string = `<div class="marked-image"><img src="${_src}"`
  string += `class="marked-src" title="${title || alt || ''}"`
  string += `data-echo="${src}" class="img-pop" />`
  if(title || alt)
    string += `<div class="marked-caption"><div class="marked-caption-text">${title || alt}</div></div>`
  string += '</div>'
  return string
}

// 外链
const linkParse = (href, title, text) => {
  if(!href)
    return '';
  const target = href.substr(0, 1) === '#' ? '_self' : '_blank'
  const cName = href.substr(0, 1) === '#' ? '' : 'marked-link'
  let string = `<a href="${href}" target="${target}" class="${cName}">${text}</a>`
  string = string.replace(/\s+/g, ' ').replace('\n', '')
  return string
}

const headingParse = (text,level,raw) => {
  if(!text)
    return ''
  return `<div class="marked-head"><h${level} class="marked-h${level}">${text}</h${level}></div>`
}

const blockquoteParse = string => {
  if(!string)
    return ''
  return `<div class="marked-blockquote"><blockquote>${string}</blockquote></div>`
}

const HTML_DECODE = str => {
  if (str.length === 0)
    return ''
  str = str.replace(/&amp;/g, '&')
  str = str.replace(/&lt;/g, '<')
  str = str.replace(/&gt;/g, '>')
  return str
}

const getLines = code => {
  try{
    const lines = code.split(EOL)
    let str = `<div class="marked-line">`
    str += '<div class="marked-line-box">'
    for(let i=1;i<=lines.length;i++){
      str += `<div class="marked-number">${i}</div>`
    }
    str += `</div></div>`
    return str
  }catch(ex){
    return ''
  }
}

const headingCode = (code,lang) => {
  if(!code)
    return ''
  code = HTML_DECODE(code)
  if (!~languages.indexOf(lang)) {
    code = Hljs.highlightAuto(code).value
  }else{
    code = Hljs.highlight(lang, code).value
  }
  return `<div class="marked-code"><pre class="marked-scroll"><code class="language-${lang}">${code}</code></pre></div>`
}

const htmlParse = html => {
  return `<div class="marked-html">${html}</div>`
}

renderer.link = linkParse
renderer.paragraph = paragraphParse
renderer.image = imageParse
renderer.heading = headingParse
renderer.code = headingCode
renderer.html = htmlParse
renderer.blockquote = blockquoteParse

const htmlStr = (content,options = {}) => {
  if (typeof content !== 'string')
    return ''
  let html = marked(content, { renderer })
  // 返回解析内容
  html = `<div class="marked-body markdown-body">${html}</div>`
  return { html }
}
export default content => {
  let { html } = htmlStr(content)
  return { html }
}
