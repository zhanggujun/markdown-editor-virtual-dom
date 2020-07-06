import './style/reset.scss'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'
import './style/index.scss'
import isElement from 'lodash/isElement'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import debounce from 'lodash/debounce'

import marked from './util/marked'

import { ToolLeft,ToolRight } from './util/tool'

import VNode from './util/vnode'
import Range from './util/range'

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

class Editor{
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
    this.VNode = new VNode(this)
    this.proxyData()
    this.initVNode()
    this.pluginsCall()
    // range
    this.Range = new Range(this)
  }
  static install(name,descriptor){
    if (!Editor.plugins) {
      Editor.plugins = {}
    }
    Editor.plugins[name] = descriptor
  }
  pluginsCall(){
    if(Editor.plugins){
      Object.keys(Editor.plugins).forEach(name => {
        if(name !== 'marked'){
          let descriptor = Editor.plugins[name]
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
          self.VNode.render()
        }
      })
    }
  }
  pluginsMarked(){
    const { value = '' } = this.options || {}
    let descriptor = Editor.plugins['marked']
    return isFunction(descriptor) ? descriptor.call(this,this,value) : marked(value).html
  }
  insertBefore(text){
    this.Range.insertBefore(text)
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
        this.Range.insertBefore(item.code,item.range)
      }
      item.handler()
    }
  }
  handlerControl(item){
    // if(item.name === 'splitscreen'){
    //   this.options.split = !this.options.split
    //   if(this.options.split){
    //     this.options.preview = false
    //   }else{
    //     console.log('hello')
    //   }
    // }else if(item.name === 'preview'){
    //   this.options.preview = !this.options.preview
    //   if(this.options.preview){
    //     this.status = this.options.split
    //     this.options.split = false
    //     this.oldbar = this.options._toolbar
    //     this.options._toolbar = []
    //   }else{
    //     this.options.split = this.status
    //     this.options._toolbar = this.oldbar
    //   }
    // }else if(item.name === 'fullscreen'){
    //   this.options.full = !this.options.full
    // }
  }
  initVNode(){
    this.VNode.render()
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

// 默认plugins

// 渲染marked内容
const defaultMarked = (editor,value) => {
  return marked(value).html
}
Editor.install('marked',defaultMarked)

export default Editor