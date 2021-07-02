
import '@/style/thor.scss'
import '@/style/reset.scss'
import 'github-markdown-css/github-markdown.css'

import { default as Core } from '@/core/core.js'

import { initCorePlugins } from '@/utils/index.js'

const plugin = value => {
  return marked(value)
}
const plugin2 = value => {
  return marked(`${value}<div style="color:#0000ff;">重新来过哇</div>`)
}

class Thor extends Core{
  constructor(el,options){
    const plugins = [plugin,plugin2]
    const merge = { ...options,plugins }
    super(el,merge)
  }
}


export default Thor
