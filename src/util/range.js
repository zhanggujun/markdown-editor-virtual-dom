class Range{
  constructor(editor){
    this.editor = editor
    this.mark = document.querySelector(`#${editor.mark}`)
  }
  getElement(){
    return this.mark.querySelector('.md-textarea')
  }
  getSelection(){
    let box = this.getElement()
    return {
      start:box.selectionStart,
      end:box.selectionEnd
    }
  }
  insertBefore(text,revise = 0,fn){
    const box = this.getElement()
    const range = this.getSelection()
    const { value = '' } = this.editor.options || {}
    let _value = ''
    const start = value.substring(0,range.start)
    const end = value.substring(range.start)
    if(range.start === range.end){
      _value = start + text + end
    }else{
      const replace = value.substring(range.start,range.end)
      _value = (start + text + end).replace(replace,'')
    }
    this.editor.options.value = _value
  }
  insertAfter(text){}
}

export default Range
