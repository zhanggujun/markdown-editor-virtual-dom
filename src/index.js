import './style/reset.scss'
import './style/index.scss'

import MdCreate from './lib/editor'
import MdMarked from './lib/marked'

class MdEditor{
  constructor(){
    this.MdCreate = MdCreate
    this.MdMarked = MdMarked
  }
}


export default new MdEditor()
