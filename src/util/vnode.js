import isFunction from 'lodash/isFunction'

import { init } from '../vnode/init'
import { classModule } from '../vnode/modules/class'
import { propsModule } from '../vnode/modules/props'
import { styleModule } from '../vnode/modules/style'
import { attributesModule } from '../vnode/modules/attributes'
import { eventListenersModule } from '../vnode/modules/eventlisteners'
import { h } from '../vnode/h'

import marked from './marked'
import Editor from '../index'

const patch = init([
  classModule,
  propsModule,
  styleModule,
  attributesModule,
  eventListenersModule
])

class VNode{
  constructor(editor){
    this.Editor = editor
  }
  _createBox(){
    const { split,full,preview } = this.Editor.options || {}
    let sel = `div#${this.Editor.mark}.md-box`
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
    const { height = '500px' } = this.Editor.options
    return h(sel,{
      style: {
        height: height || '500px'
      },
      key: 'md-editor'
    },[
      this.createHead(),
      this.createBody()
    ])
  }
  createToolLeft(){
    const { _toolbar = [],keyboard = true } = this.Editor.options || {}
    const toolLeft = _toolbar.map(item => {
      const title = keyboard ? `${item.title} ${item.key}` : `${item.title}`
      return h(`i.md-icon.iconfont.${item.icon}`,{
        attrs:{
          'data-name':item.name,
          title
        },
        key: item.name,
        on:{
          click:() => this.Editor.handlerToolbar(item)
        }
      })
    })
    return h('div.md-tool.md-tool-l',{
      key: 'md-tool-l'
    },[
      ...toolLeft
    ])
  }
  createControl(sel,item){
    return h(sel,{
      attrs: {
        'data-name':item.name,
        'title': `${item.title} ${item.key}`
      },
      key: item.name,
      on:{
        click:() => this.Editor.handlerControl(item)
      }
    })
  }
  createSplit(){
    const { control = [],split = true } = this.Editor.options || {}
    const item = control[0]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(split)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createPreview(){
    const { control = [],preview = false } = this.Editor.options || {}
    const item = control[1]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(preview)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createFull(){
    const { control = [],full = false } = this.Editor.options || {}
    const item = control[2]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(full)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createToolRight(){
    return h('div.md-tool.md-tool-r',{
      key: 'md-tool-r'
    },[
      this.createSplit(),
      this.createPreview(),
      this.createFull()
    ])
  }
  createHead(){
    return h('div.md-head',{
      key: 'md-head'
    },[
      this.createToolLeft(),
      this.createToolRight()
    ])
  }
  createBody(){
    return h('div.md-body',{
      key: 'md-body'
    },[
      this.createEdit(),
      this.createText()
    ])
  }
  createEdit(){
    const { value = '',placeholder = '' } = this.Editor.options || {}
    return h('div.md-edit',{
      key: 'md-edit'
    },[
      h('textarea.md-textarea.md-scroll',{
        props:{
          placeholder,
          value
        },
        on:{
          input:(event) => this.Editor.onTextChange(event),
          compositionstart:() => this.Editor.onLockInput(true),
          compositionend:() => this.Editor.onLockInput(false),
          scroll:() => console.log('scroll')
        },
        key: 'md-textarea'
      })
    ])
  }
  createText(){
    const { value = '',empty = '预览区域' } = this.Editor.options || {}
    return h('div.md-text.md-scroll',{
      key: 'md-text'
    },[
      value ? h('div.md-main',{
        props:{
          innerHTML: this.Editor.pluginsMarked()
        },
        key: 'md-main'
      }) : h('div.md-empty',{ key: 'md-empty' },empty)
    ])
  }
  render(){
    const VNode = this.createBox()
    if(this.VNode){
      patch(this.VNode,VNode)
    }else{
      patch(this.Editor.el,VNode)
    }
    this.VNode = VNode
  }
}

export default VNode