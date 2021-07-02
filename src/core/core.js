
import App from '@/template/thor.svelte'

import { symbolPrivatedThor,symbolPrivatedPlugins,initPlugins } from '@/utils/index.js'

class Thor{
  constructor(el,options = {}){
    this[symbolPrivatedThor](el,options)
    return this
  }
  [symbolPrivatedThor](el,options = {}){
    const core = new App({
      target: el,
      props: { ...options }
    })
    core.set = core.$set
    core.on = core.$on
    core.destroy = core.$destroy
    this.core = this.editor = this.options = core
  }
  setValue(value){
    this.core.set({ value })
  }
  getValue(){
    return this.core.value
  }
}

export default Thor
