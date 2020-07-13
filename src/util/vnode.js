import isFunction from 'lodash/isFunction'

import { init } from '../vnode/init'
import { classModule } from '../vnode/modules/class'
import { propsModule } from '../vnode/modules/props'
import { styleModule } from '../vnode/modules/style'
import { attributesModule } from '../vnode/modules/attributes'
import { eventListenersModule } from '../vnode/modules/eventlisteners'
import { h } from '../vnode/h'

const patch = init([
  classModule,
  propsModule,
  styleModule,
  attributesModule,
  eventListenersModule
])

class VNode{
  constructor(editor){
    this.editor = editor
  }
  createBox(){
    const { height = '500px',split,full,preview,shadow } = this.editor.options
    return h(`div#${this.editor.mark}.md-box`,{
      style: {
        height: height || '500px'
      },
      class: {
        'md-split': split,
        'md-full': full,
        'md-preview': preview,
        'md-shadow': shadow
      },
      key: 'md-editor'
    },[
      this.createHead(),
      this.createBody()
    ])
  }
  createToolLeft(){
    const { _toolbar = [],keyboard = true } = this.editor.options || {}
    const toolLeft = _toolbar.map(item => {
      const title = keyboard ? `${item.title} ${item.key}` : `${item.title}`
      return h(`i.md-icon.iconfont.${item.icon}`,{
        attrs:{
          'data-name':item.name,
          title
        },
        key: item.name,
        on:{
          click:() => this.editor.handlerToolbar(item)
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
        click:() => this.editor.handlerControl(item)
      }
    })
  }
  createSplit(){
    const { control = [],split = true } = this.editor.options || {}
    const item = control[0]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(split)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createPreview(){
    const { control = [],preview = false } = this.editor.options || {}
    const item = control[1]
    let sel = `i.md-icon.iconfont.${item.icon}`
    if(preview)
      sel += ' .md-active'
    return this.createControl(sel,item)
  }
  createFull(){
    const { control = [],full = false } = this.editor.options || {}
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
    const { shadow } = this.editor.options || {}
    return h('div.md-head',{
      class: {
        'md-shadow' : shadow
      },
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
    const { value = '',placeholder = '' } = this.editor.options || {}
    return h('div.md-edit',{
      key: 'md-edit'
    },[
      h('textarea.md-textarea.md-scroll',{
        props:{
          placeholder,
          value
        },
        on:{
          input:(event) => this.editor.onTextChange(event),
          compositionstart:() => this.editor.onLockInput(true),
          compositionend:() => this.editor.onLockInput(false),
          scroll:() => console.log('scroll')
        },
        key: 'md-textarea'
      })
    ])
  }
  createText(){
    const { value = '',empty = '预览区域' } = this.editor.options || {}
    return h('div.md-text.md-scroll',{
      key: 'md-text'
    },[
      value ? h('div.md-main',{
        props:{
          innerHTML: this.editor.pluginsMarked()
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
      patch(this.editor.el,VNode)
    }
    this.VNode = VNode
  }
}

export default VNode
