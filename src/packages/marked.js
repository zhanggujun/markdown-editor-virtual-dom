import markdownIt from 'markdown-it'
import markdowKatex from '@iktakahiro/markdown-it-katex'
import Hljs from '../util/highlight'

const languages = ['cpp', 'xml', 'bash', 'coffeescript', 'css', 'markdown', 'http', 'java', 'javascript', 'json', 'less', 'makefile', 'nginx', 'php', 'python', 'scss', 'sql', 'stylus','js','https']

const marked = markdownIt({
  highlight(code,lang){
    if (!~languages.indexOf(lang)) {
      return Hljs.highlightAuto(code).value
    }
    return Hljs.highlight(lang, code).value
  }
})

class MdMarked{
  constructor(){
    this.use(markdowKatex,{ 'throwOnError':false, 'errorColor':'#cc0000' })
  }
  render(value){
    const string = marked.render(value)
    return `<div class="marked-body markdown-body">${string}</div>`
  }
  use(name,options = {}){
    marked.use(name,options)
    return this
  }
}

export default new MdMarked()
