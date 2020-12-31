import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
import { h } from 'snabbdom/build/package/h'

import { isDeep,flatten } from '../util/index'
import { left } from '../util/toolbar'

const patch = init([ classModule,propsModule,styleModule,eventListenersModule ])

const a = [1,2,3,4,5,6,7,5,5,6,4,4]

class VNode{
  constructor(editor){
    this.editor = editor
  }
  head(){
    return h('div.md-head','head',[
      this.toolbar(),
      this.control()
    ])
  }
  control(){
    const control = [1,2,3].map((item,index) => h('i.md-icon.iconfont.icon-center_align_text',{ key: index }))
    return h('div.md-control',[ ...control ])
  }
  toolbar(){
    return h('div.md-toolbar',[ ...this.toolicon() ])
  }
  toolicon(){
    const tool = left()
    const deep = isDeep(tool)
    const array = deep ? flatten(tool) : tool
    const renderIcon = (item,index) => h(`i.md-icon.iconfont.${item.icon}`,{
      key: index,
      on:{
        click:event => this.editor.tool(item)
      }
    })
    const icon = array.map((item,index) => item ? renderIcon(item) : h('i.md-icon-line',{ key: index }))
    return icon
  }
  body(){
    return h('div.md-body',[
      this.text(),
      this.view()
    ])
  }
  text(){
    const { value,placeholder } = this.editor.options || {}
    return h('div.md-text',[
      h('textarea.md-textarea',{
        props:{
          placeholder,
          value,
          spellcheck: false
        }
      })
    ])
  }
  view(){
    return h('div.md-view','view')
  }
  create(){
    return h(`div#${this.editor.box}.md-box`,{
      key: 'md-box',
      style:{ height: '600px' }
    },[
      this.head(),
      this.body()
    ])
  }
  render(){
    const VNode = this.create()
    if(this.VNode){
      patch(this.VNode,VNode)
    }else{
      patch(this.editor.el,VNode)
    }
    this.VNode = VNode
  }
}

export default VNode
