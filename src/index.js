import './style/reset.scss'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'
import './style/index.scss'
import isElement from 'lodash/isElement'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import debounce from 'lodash/debounce'

import marked from './util/marked'

import { init } from './vnode/init'
import { classModule } from './vnode/modules/class'
import { propsModule } from './vnode/modules/props'
import { styleModule } from './vnode/modules/style'
import { attributesModule } from './vnode/modules/attributes'
import { eventListenersModule } from './vnode/modules/eventlisteners'
import { h } from './vnode/h'

import { ToolLeft,ToolRight } from './util/tool';

const patch = init([
  classModule,
  propsModule,
  styleModule,
  attributesModule,
  eventListenersModule
])

const error = msg => console.error(msg)

const tool = ['undo','redo', 'bold', 'italic', 'underline', 'strikethrough', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote','code', 'orderedlist', 'unorderedlist', 'link', 'table', 'line', 'image']

const defaultOptions = {
  value: '',
  placeholder: '请输入内容',
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
      _toolbar:getToolBar(toolbar),...options,
      preview: ((options.split && options.preview) ? false : options.preview) || false,
      text: options.value ? options.value : ''
    }
    this.options = { ...defaultOptions,..._options }
    this.proxyData()
    this.initHtml()
    this.pluginsCall()
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
          self.render()
        }
      })
    }
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
      console.log(item)
    }
  }
  _createBox(){
    const { split,full,preview } = this.options || {}
    let sel = 'div.md-box'
    if(split)
      sel += ' md-split'
    if(full)
      sel += ' md-full'
    if(preview)
      sel += ' md-preview'
    return sel
  }
  createBox(){
    const sel = this._createBox()
    return h(sel,{
      style: {
        height: this.options.height || '500px'
      }
    },[
      this.createHead(),
      this.createBody()
    ])
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
  createToolLeft(){
    const { _toolbar = [],keyboard = true } = this.options || {}
    const toolLeft = _toolbar.map(item => {
      const title = keyboard ? `${item.title} ${item.key}` : `${item.title}`
      return h(`i.md-icon.iconfont.${item.icon}`,{
        attrs:{
          'data-name':item.name,
          title
        },
        on:{
          click:() => this.handlerToolbar(item)
        }
      })
    })
    return h('div.md-tool.md-tool-l',[
      ...toolLeft
    ])
  }
  createControl(sel,item){
    return h(sel,{
      attrs: {
        'data-name':item.name,
        'title': `${item.title} ${item.key}`
      },
      on:{
        click:() => this.handlerControl(item)
      }
    })
  }
  createSplit(){
    const { control = [],split = true } = this.options || {}
    const item = control[0]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(split)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createPreview(){
    const { control = [],preview = false } = this.options || {}
    const item = control[1]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(preview)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createFull(){
    const { control = [],full = false } = this.options || {}
    const item = control[2]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(full)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createToolRight(){
    return h('div.md-tool.md-tool-r',[
      this.createSplit(),
      this.createPreview(),
      this.createFull()
    ])
  }
  createHead(){
    return h('div.md-head',{},[
      this.createToolLeft(),
      this.createToolRight()
    ])
  }
  createBody(){
    return h('div.md-body',[
      this.createEdit(),
      this.createText()
    ])
  }
  createEdit(){
    const { value = '',placeholder = '' } = this.options || {}
    return h('div.md-edit',{},[
      h('textarea.md-textarea.md-scroll',{
        props:{
          placeholder
        },
        on:{
          input:(event) => this.onTextChange(event),
          compositionstart:() => this.onLockInput(true),
          compositionend:() => this.onLockInput(false)
        },
      },value)
    ])
  }
  _marked(){
    const { value = '' } = this.options || {}
    let descriptor = Editor.plugins['marked']
    return isFunction(descriptor) ? descriptor.call(this,this,value) : marked(value).html
  }
  createText(){
    return h('div.md-text.md-scroll',[
      h('div.md-main',{
        props:{
          innerHTML: this._marked()
        }
      })
    ])
  }
  render(){
    const vnode = this.createBox()
    if(this.vnode){
      patch(this.vnode,vnode)
    }else{
      patch(this.el,vnode)
    }
    this.vnode = vnode
  }
  initHtml(){
    this.render()
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