import './style/reset.scss'
import './style/index.scss'

import CoreEditor from './core/editor'

const Editor = (el,options = {}) => {
  const editor = new CoreEditor(el,options)
}

export default Editor

