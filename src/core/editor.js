import VNode from '../vnode'
import Range from '../range'
import isElement from 'lodash/isElement'
import isFunction from 'lodash/isFunction'

const error = msg => console.error(msg)

let EditorVNode
let EditorRange

const opt = {
  value: '',
  placeholder: '请输入内容'
}

class Editor{
  constructor(el,options = {}){
    this.el = isElement(el) ? el : document.querySelector(el)
    this.box = (`md-${new Date().getTime()}-${Math.random()}`).replace('.','')
    if(!this.el)
      return error(`参数'${el}'不是一个HTMLElement元素`)
    const merge = { ...options,...opt }
    this.options = merge || {}
    EditorVNode = new VNode(this)
    this.proxy()
    this.init()
    EditorRange = new Range(this)
  }
  init(){
    this.render()
  }
  tool(item){
    if(isFunction(item.handler)){
      item.handler(item)
    }else{
      item.handler = () => {
        EditorRange.insertBefore(item.code,item.range)
      }
      item.handler()
    }
  }
  proxy(){
    const self = this
    for(let key in this.options){
      let value = this.options[key]
      Object.defineProperty(this.options,key,{
        enumerable: true,
        configurable: true,
        get(){
          return value
        },
        set(val){
          value = val
          self.render()
        }
      })
    }
  }
  render(){
    EditorVNode.render()
  }
}

export default Editor
