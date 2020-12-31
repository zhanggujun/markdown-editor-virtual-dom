class Range{
  constructor(editor){
    this.editor = editor
    this.element = this.getElement()
  }
  getElement(){
    const box = document.querySelector(`#${this.editor.box}`)
    const element = box.querySelector('.md-textarea')
    return element || null
  }
  getSelection(){
    const box = this.element
    return {
      start:box.selectionStart,
      end:box.selectionEnd
    }
  }
  setSelectionRange(start,end){
    const box = this.element
    box.setSelectionRange(start,end)
  }
  boxFocus(start = 0,end = 0){
    const box = this.element
    setTimeout(() => {
      this.setSelectionRange(start,end)
      box.focus()
    },0)
  }
  insertBefore(text,revise = 0,fn){
    const range = this.getSelection()
    if(!text)
      return this.boxFocus(range.start || 0,range.end || 0)
    const box = this.element
    const { value = '' } = this.editor.options || {}
    let _value = ''
    const start = value.substring(0,range.start)
    const end = value.substring(range.start)
    const _text = start + text + end
    if(range.start === range.end){
      _value = _text
    }else{
      const replaceText = value.substring(range.start,range.end)
      _value = _text.replace(replaceText,'')
    }
    const _range = range.start + text.length + revise
    this.editor.options.value = _value
    this.boxFocus(_range,_range)
  }
  insertAfter(text){}
}

export default Range
