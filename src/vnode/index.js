import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
import { h } from 'snabbdom/build/package/h'

import { isDeep,flatten } from '../util/index'

const patch = init([ classModule,propsModule,styleModule,eventListenersModule ])

const a = [1,2,3,4,5,6,7,5,5,6,4,4]

class VNode{
  constructor(editor){
    this.editor = editor
    console.log('this.editor',this.editor)
  }
  head(){
    return h('div.md-head','head',[
      this.toolbar(),
      this.control()
    ])
  }
  body(){
    return h('div.md-body','body')
  }
  control(){
    const control = [1,2,3].map((item,index) => h('i.md-icon.iconfont.icon-center_align_text',{ key: index }))
    return h('div.md-control',[ ...control ])
  }
  toolbar(){
    return h('div.md-toolbar',[ ...this.toolicon() ])
  }
  toolicon(){
    const deep = isDeep(a)
    const array = deep ? flatten(a) : a
    const icon = array.map((item,index) => item ? h('i.md-icon.iconfont.icon-center_align_text',{ key: index }) : h('i.md-icon-line',{ key: index }))
    return icon
  }
  create(){
    return h('div.md-box',[
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
