import VNode from '../vnode'
import isElement from 'lodash/isElement'

const error = msg => console.error(msg)

let ElementVNode

class Editor{
  constructor(el,options = {}){
    this.el = isElement(el) ? el : document.querySelector(el)
    if(!this.el)
      return error(`参数'${el}'不是一个HTMLElement元素`)
    ElementVNode = new VNode(this)
    this.init()
  }
  init(){
    this.render()
  }
  render(){
    ElementVNode.render()
  }
}

export default Editor
