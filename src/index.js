import './style/reset.scss'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'
import './style/index.scss'

import MdCreate from './packages/editor'
import MdMarked from './packages/marked'

class MdEditor{
  constructor(){
    this.MdCreate = MdCreate
    this.MdMarked = MdMarked
  }
}



export default new MdEditor()
