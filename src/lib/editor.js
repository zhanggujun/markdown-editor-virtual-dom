import isElement from 'lodash/isElement'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import debounce from 'lodash/debounce'

import { ToolLeft,ToolRight } from '../util/tool'

import VNode from '../util/vnode'
import Range from '../util/range'

const error = msg => console.error(msg)

const tool = ['undo','redo', 'bold', 'italic', 'underline', 'strikethrough', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote','code', 'orderedlist', 'unorderedlist', 'link', 'table', 'line', 'image']

const defaultOptions = {
  value: '',
  placeholder: '请输入内容...',
  empty: '预览区域',
  height: '500px',
  keyboard: true,
  full:false,
  split:true,
  preview:false,
  shadow: true,
  control: [ ...ToolRight ]
}

const getToolBar = tool => {
  let array = []
  for(let i=0,l1=ToolLeft.length;i<l1;i++){
    const d1 = ToolLeft[i]
    for(let j=0,l2=tool.length;j<l2;j++){
      const d2 = tool[j]
      if(d1.name === d2){
        array.push(d1)
      }
    }
  }
  return array
}

let createVNode = null
let createRange = null

class MdCreate{
  constructor(el = null,options = {}){
    this.el = isElement(el) ? el : document.querySelector(el)
    if(!isElement(this.el))
      return error('editor init el is not HTMLElement')
    let toolbar = (isArray(options.toolbar) && options.toolbar.length) ? [ ...options.toolbar ] : [ ...tool ]
    const _options = {
      _toolbar:getToolBar(toolbar),
      ...options,
      preview: ((options.split && options.preview) ? false : options.preview) || false,
    }
    this.mark = (`md-${new Date().getTime()}-${Math.random()}`).replace('.','')
    this.options = { ...defaultOptions,..._options }
    createVNode = new VNode(this)
    this.proxyData()
    this.initVNode()
    this.pluginsCall()
    // range
    createRange = new Range(this)
  }
  static install(name,descriptor){
    if (!MdCreate.plugins) {
      MdCreate.plugins = {}
    }
    MdCreate.plugins[name] = descriptor
  }
  pluginsCall(){
    if(MdCreate.plugins){
      Object.keys(MdCreate.plugins).forEach(name => {
        if(name !== 'marked'){
          let descriptor = MdCreate.plugins[name]
          if(isFunction(descriptor)){
            descriptor.call(this,this)
          }
        }
      })
    }
  }
  proxyData(){
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
          createVNode.render()
        }
      })
    }
  }
  pluginsMarked(){
    const { value = '' } = this.options || {}
    let descriptor = MdCreate.plugins['marked']
    return isFunction(descriptor) ? descriptor.call(this,this,value) : value
  }
  insertBefore(text){
    createRange.insertBefore(text)
  }
  insertAfter(text){

  }
  onLockInput(bool){
    this.lock = bool
  }
  onTextChange(event){
    debounce(() => {
      if(this.lock)
        return false
      const { value } = event.target
      this.options.value = value
    },50)()
  }
  handlerToolbar(item){
    if(isFunction(item.handler)){
      item.handler(item)
    }else{
      item.handler = () => {
        createRange.insertBefore(item.code,item.range)
      }
      item.handler()
    }
  }
  handlerControl(item){

  }
  initVNode(){
    createVNode.render()
  }
  addTool(item){
    this.options._toolbar = [ ...this.options._toolbar,item ]
  }
  getTool(name){
    if(!name)
      return error('editor handler getTool(name)，name is not defined')
    return this.options._toolbar.find(item => item.name === name)
  }
}

export default MdCreate
