import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
import { h } from 'snabbdom/build/package/h'

const patch = init([ classModule,propsModule,styleModule,eventListenersModule ])

class VNode{
  constructor(editor){
    this.editor = editor
    console.log('this.editor',this.editor)
  }
  create(){
    return h('i.iconfont.icon-center_align_text')
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
